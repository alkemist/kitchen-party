import {Injectable} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {orderBy} from 'firebase/firestore';
import {Observable, Subscription} from 'rxjs';
import {ingredientConverter, IngredientInterface, IngredientModel} from '../models/ingredient.model';
import {AddIngredient, FillIngredients, RemoveIngredient, UpdateIngredient} from '../store/ingredient.action';
import {IngredientState} from '../store/ingredient.state';
import {ArrayHelper} from '../tools/array.helper';
import {DocumentNotFound, FirestoreService} from './firestore.service';
import {LoggerService} from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class IngredientService extends FirestoreService<IngredientInterface> {
  @Select(IngredientState.lastUpdated) override lastUpdated$?: Observable<Date>;
  @Select(IngredientState.all) protected override all$?: Observable<IngredientInterface[]>;

  private allSubscription?: Subscription;
  private all: IngredientModel[] = [];

  constructor(private logger: LoggerService, private store: Store) {
    super(logger, 'ingredient', ingredientConverter);
  }

  async getListOrRefresh(): Promise<IngredientModel[]> {
    if (this.allSubscription) {
      this.allSubscription.unsubscribe();
    }
    if (this.all.length > 0 || this.refreshed) {
      return this.all;
    }

    return new Promise<IngredientModel[]>(resolve => {
      this.all$?.subscribe(async ingredients => {
        if (ingredients.length === 0 && !this.refreshed || this.storeIsOutdated()) {
          await this.refreshList();
        }

        this.all = [];
        for (const ingredient of ingredients) {
          this.all.push(new IngredientModel(ingredient));
        }
        this.all = ArrayHelper.sortBy<IngredientModel>(this.all, 'slug');
        resolve(this.all);
      });
    });
  }

  async search(query: string): Promise<IngredientModel[]> {
    const ingredients = await this.getListOrRefresh();
    return ingredients.filter((ingredient: IngredientModel) => {
      return ingredient.nameContain(query);
    });
  }

  async getBySlug(slug: string): Promise<IngredientModel | undefined> {
    const ingredients = await this.getListOrRefresh();
    const ingredient = ingredients.find((ingredient: IngredientInterface) => {
      return ingredient.slug === slug;
    })!;
    return ingredient ?? undefined;
  }

  async getById(id: string): Promise<IngredientModel | undefined> {
    const ingredients = await this.getListOrRefresh();
    const ingredient = ingredients.find((ingredient: IngredientModel) => {
      return ingredient.id === id;
    })!;
    return ingredient ?? undefined;
  }

  async get(slug: string, forceRefresh = false): Promise<IngredientModel | undefined> {
    if (!slug) {
      return undefined;
    }

    let ingredient = await this.getBySlug(slug);
    if (!ingredient || forceRefresh) {
      try {
        const ingredientData = await super.findOneBySlug(slug);
        return new IngredientModel(this.addToStore(ingredientData));
      } catch (e) {
        if (e instanceof DocumentNotFound) {
          return undefined;
        }
      }
    }
    return ingredient;
  }

  async add(ingredient: IngredientInterface): Promise<IngredientInterface | undefined> {
    const ingredientStored = await super.addOne(new IngredientModel(ingredient));
    return this.addToStore(ingredientStored);
  }

  async update(ingredient: IngredientInterface): Promise<IngredientInterface | undefined> {
    const ingredientStored = await super.updateOne(new IngredientModel(ingredient));
    this.store.dispatch(new UpdateIngredient(ingredientStored));
    return ingredientStored;
  }

  async remove(ingredient: IngredientInterface): Promise<void> {
    await super.removeOne(ingredient);
    this.store.dispatch(new RemoveIngredient(ingredient));
  }

  override async exist(name: string): Promise<boolean> {
    return await super.exist(name);
  }

  private addToStore(ingredient: IngredientInterface): IngredientInterface {
    this.store.dispatch(new AddIngredient(ingredient));
    return ingredient;
  }

  private async refreshList(): Promise<void> {
    const ingredients = await super.select(orderBy('name'));

    this.store.dispatch(new FillIngredients(ingredients));
  }
}

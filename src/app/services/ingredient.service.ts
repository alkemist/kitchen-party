import { Injectable } from '@angular/core';
import { ingredientConverter } from '@converters';
import { DocumentNotFoundError } from '@errors';
import { IngredientInterface } from '@interfaces';
import { IngredientModel } from '@models';
import { Select, Store } from '@ngxs/store';
import { FirestoreService, LoggerService } from '@services';
import { AddIngredient, FillIngredients, IngredientState, RemoveIngredient, UpdateIngredient } from '@stores';
import { ArrayHelper } from '@tools';
import { orderBy } from 'firebase/firestore';
import { first, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IngredientService extends FirestoreService<IngredientInterface> {
  @Select(IngredientState.lastUpdated) override lastUpdated$?: Observable<Date>;
  @Select(IngredientState.all) protected override all$?: Observable<IngredientInterface[]>;

  private all: IngredientModel[] = [];
  private promise: Promise<IngredientModel[]> | undefined;

  constructor(private logger: LoggerService, private store: Store) {
    super(logger, 'ingredient', ingredientConverter);
  }

  async getListOrRefresh(): Promise<IngredientModel[]> {
    if (this.promise) {
      return this.promise;
    }

    if ((this.all.length > 0 || this.refreshed) && this.synchronized) {
      return this.all;
    }

    this.promise = new Promise<IngredientModel[]>(resolve => {
      if (this.getAll$()) {
        this.getAll$()?.pipe(first()).subscribe(async ingredients => {
          if (ingredients.length === 0 && !this.refreshed || this.storeIsOutdated()) {
            ingredients = await this.refreshList();
          }

          this.all = [];
          for (const ingredient of ingredients) {
            this.all.push(new IngredientModel(ingredient));
          }
          this.all = ArrayHelper.sortBy<IngredientModel>(this.all, 'slug');
          this.synchronized = true;
          resolve(this.all);
        });
      } else {
        resolve(this.all);
      }
    });
    return this.promise;
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
        if (e instanceof DocumentNotFoundError) {
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

  public async refreshList(): Promise<IngredientInterface[]> {
    const ingredients = await super.promiseQueryList(orderBy('name'));

    this.store.dispatch(new FillIngredients(ingredients));
    return ingredients;
  }
}

import {Injectable} from '@angular/core';
import {ingredientConverter} from '@converters';
import {DocumentNotFoundError} from '@errors';
import {IngredientInterface} from '@interfaces';
import {IngredientModel} from '@models';
import {Select, Store} from '@ngxs/store';
import {FirestoreService, LoggerService} from '@services';
import {AddIngredient, FillIngredients, IngredientState, RemoveIngredient, UpdateIngredient} from '@stores';
import {ArrayHelper} from '@tools';
import {orderBy} from 'firebase/firestore';
import {first, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class IngredientService extends FirestoreService<IngredientInterface> {
  @Select(IngredientState.lastUpdated) override lastUpdated$?: Observable<Date>;

  // Données du store
  @Select(IngredientState.all) protected override all$?: Observable<IngredientInterface[]>;

  // Données du service
  private all: IngredientModel[] = [];

  constructor(private logger: LoggerService, private store: Store) {
    super(logger, 'ingredient', ingredientConverter);
  }

  async getListOrRefresh(): Promise<IngredientModel[]> {
    return new Promise<IngredientModel[]>(async resolve => {
      // Si les données ont déjà été chargé dans le service
      if (this.loaded) {
        resolve(this.all);
      }
      // Sinon, si des données à jour sont dans le store
      else if (this.all$ && !this.storeIsOutdated()) {
        this.getAll$()?.pipe(first()).subscribe(async ingredients => {
          this.refreshList(ingredients);
          this.loaded = true;
          resolve(this.all);
        })

      }
      // Sinon on rafraichit le store
      else {
        const ingredients = await super.queryList(orderBy('name'));
        this.store.dispatch(new FillIngredients(ingredients));

        this.refreshList(ingredients);
        this.loaded = true;
        resolve(this.all);
      }
    });
  }

  refreshList(ingredients: IngredientInterface[]): IngredientModel[] {
    this.all = [];
    for (const ingredient of ingredients) {
      this.all.push(new IngredientModel(ingredient));
    }
    this.all = ArrayHelper.sortBy<IngredientModel>(this.all, 'slug');
    return this.all;
  }

  async search(query: string): Promise<IngredientModel[]> {
    const ingredients = await this.getListOrRefresh();
    return ingredients.filter((ingredient: IngredientModel) => {
      return ingredient.nameContain(query);
    });
  }

  async getById(id: string, forceRefresh = false): Promise<IngredientModel | undefined> {
    if (!id) {
      return undefined;
    }

    const ingredients = await this.getListOrRefresh();
    const ingredient = ingredients.find((ingredient: IngredientModel) => {
      return ingredient.id === id;
    })!;

    if (!ingredient || forceRefresh) {
      try {
        const ingredientData = await super.findOneById(id);

        await this.addToStore(ingredientData);
        this.invalidLocalData();

        return new IngredientModel(ingredientData);
      } catch (e) {
        if (e instanceof DocumentNotFoundError) {
          return undefined;
        }
      }
    }

    return ingredient;
  }

  async getBySlug(slug: string, forceRefresh = false): Promise<IngredientModel | undefined> {
    if (!slug) {
      return undefined;
    }

    const ingredients = await this.getListOrRefresh();
    const ingredient = ingredients.find((ingredient: IngredientModel) => {
      return ingredient.slug === slug;
    })!;

    if (!ingredient || forceRefresh) {
      try {
        const ingredientData = await super.findOneBySlug(slug);
        await this.addToStore(ingredientData);
        this.invalidLocalData();

        return new IngredientModel(ingredientData);
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
    return await this.addToStore(ingredientStored);
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

  async addToStore(ingredientStored: IngredientInterface): Promise<IngredientInterface> {
    this.store.dispatch(new AddIngredient(ingredientStored));
    return ingredientStored;
  }
}

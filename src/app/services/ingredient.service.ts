import {Injectable} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {orderBy} from 'firebase/firestore';
import {ingredientConverter, IngredientInterface, IngredientModel} from '../models/ingredient.model';
import {AddIngredient, FillIngredients, RemoveIngredient, UpdateIngredient} from '../store/ingredient.action';
import {DocumentNotFound, FirestoreService} from './firestore.service';
import {LoggerService} from './logger.service';
import {IngredientState} from "../store/ingredient.state";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IngredientService extends FirestoreService<IngredientModel> {
  @Select(IngredientState.lastUpdated) override lastUpdated$?: Observable<Date>;

  constructor(private logger: LoggerService, private store: Store) {
    super(logger, 'ingredient', ingredientConverter);
  }

  getList(): IngredientModel[] {
    const ingredients = this.store.selectSnapshot<IngredientModel[]>(state => state.ingredients.all);
    return ingredients.map(ingredient => new IngredientModel(ingredient));
  }

  async getListOrRefresh(): Promise<IngredientModel[]> {
    const ingredients = this.getList();
    if (ingredients.length === 0 || this.storeIsOutdated()) {
      return await this.refreshList();
    }
    return ingredients;
  }

  async getBySlug(slug: string): Promise<IngredientModel> {
    const ingredients = await this.getListOrRefresh();
    const ingredient = ingredients.find((ingredient: IngredientInterface) => {
      return ingredient.slug === slug;
    })!;
    return new IngredientModel(ingredient);
  }

  async getById(id: string): Promise<IngredientModel> {
    const ingredients = await this.getListOrRefresh();
    return ingredients.find((ingredient: IngredientModel) => {
      return ingredient.id === id;
    })!;
  }

  async search(query: string): Promise<IngredientModel[]> {
    const ingredients = await this.getListOrRefresh();
    return ingredients.filter((ingredient: IngredientModel) => {
      return ingredient.nameContain(query);
    });
  }

  async refreshList(): Promise<IngredientModel[]> {
    const ingredients = await super.select(orderBy('name'));
    this.store.dispatch(new FillIngredients(ingredients));
    return this.getList();
  }

  async get(slug: string): Promise<IngredientModel | undefined> {
    if (!slug) {
      return undefined;
    }

    let ingredient = await this.getBySlug(slug);
    if (!ingredient) {
      try {
        ingredient = await super.findOneBySlug(slug);
        this.store.dispatch(new AddIngredient(ingredient));
        return this.getBySlug(slug);
      } catch (e) {
        if (e instanceof DocumentNotFound) {
          return undefined;
        }
      }
    }
    return ingredient;
  }

  async add(ingredient: IngredientModel): Promise<IngredientModel> {
    const ingredientStored = await super.addOne(ingredient);
    this.store.dispatch(new AddIngredient(ingredientStored));
    return this.getBySlug(ingredientStored.slug);
  }

  async update(ingredient: IngredientModel): Promise<IngredientModel> {
    const ingredientStored = await super.updateOne(ingredient);
    this.store.dispatch(new UpdateIngredient(ingredientStored));
    return this.getBySlug(ingredientStored.slug);
  }

  async remove(ingredient: IngredientModel): Promise<void> {
    await super.removeOne(ingredient);
    this.store.dispatch(new RemoveIngredient(ingredient));
  }

  override async exist(name: string): Promise<boolean> {
    return await super.exist(name);
  }
}

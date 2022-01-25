import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {orderBy} from 'firebase/firestore';
import {ingredientConverter, IngredientModel} from '../models/ingredient.model';
import {AddIngredient, FillIngredients, RemoveIngredient, UpdateIngredient} from '../store/ingredient.action';
import {DocumentNotFound, FirestoreService} from './firestore.service';
import {LoggerService} from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class IngredientService extends FirestoreService<IngredientModel> {

  constructor(private logger: LoggerService, private store: Store) {
    super(logger, 'ingredient', ingredientConverter);
  }

  getList(): IngredientModel[] {
    return this.store.selectSnapshot<IngredientModel[]>(state => state.ingredients.all);
  }

  getBySlug(slug: string): IngredientModel {
    return this.store.selectSnapshot<IngredientModel>(state => state.ingredients.all.find((ingredient: IngredientModel) => {
      return ingredient.slug === slug;
    }));
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

    let ingredient = this.getBySlug(slug);
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

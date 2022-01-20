import {Injectable} from '@angular/core';
import {orderBy} from 'firebase/firestore';
import {Ingredient, ingredientConverter} from '../models/Ingredient';
import {DocumentNotFound, FirestoreService} from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class IngredientService extends FirestoreService<Ingredient> {

  constructor() {
    super('ingredient', ingredientConverter);
  }

  async getList(): Promise<Ingredient[]> {
    return new Promise(resolve => {
      resolve([]);
    });
    //return store.getters.allIngredients;
  }

  async refreshList(): Promise<Ingredient[]> {
    const ingredients = await super.list(orderBy('name'));
    //store.dispatch('fillIngredients', ingredients);
    return this.getList();
  }

  async get(slug: string): Promise<Ingredient | undefined> {
    let ingredient = undefined;//await store.getters.getIngredientBySlug(slug) as Ingredient;
    if (!ingredient) {
      try {
        ingredient = await super.findOneBySlug(slug);
        //store.dispatch('addIngredient', ingredient);
        return undefined; //store.getters.getIngredientBySlug(slug);
      } catch (e) {
        if (e instanceof DocumentNotFound) {
          return undefined;
        }
      }
    }
    return ingredient;
  }

  async add(ingredient: Ingredient): Promise<null> {
    const newIngredient = await super.addOne(ingredient);
    return new Promise<null>(resolve => {
      resolve(null);
    });
    //store.dispatch('addIngredient', newIngredient);
    //return store.getters.getIngredient(newIngredient.slug);
  }

  async update(ingredient: Ingredient): Promise<void> {
    await super.updateOne(ingredient);
    //return store.dispatch('updateIngredient', ingredient);
  }

  async delete(ingredient: Ingredient): Promise<void> {
    await super.deleteOne(ingredient);
    //return store.dispatch('deleteIngredient', ingredient);
  }
}

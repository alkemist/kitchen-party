import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {orderBy} from 'firebase/firestore';
import {Recipe, recipeConverter} from '../models/Recipe';
import {DocumentNotFound, FirestoreService} from './firestore.service';
import {LoggerService} from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService extends FirestoreService<Recipe> {

  constructor(private logger: LoggerService, private store: Store) {
    super(logger, 'recipe', recipeConverter);
  }

  async getList(): Promise<Recipe[]> {
    return new Promise(resolve => {
      resolve([]);
    });
    //return store.getters.allRecipes;
  }

  async refreshList(): Promise<Recipe[]> {
    const recipes = await super.select(orderBy('name'));
    recipes.forEach(recipe => this.hydrate(recipe));
    //store.dispatch('fillRecipes', recipes);
    return this.getList();
  }

  async get(slug: string): Promise<Recipe | undefined> {
    let recipe = undefined;//await store.getters.getRecipeBySlug(slug) as Recipe;
    if (!recipe) {
      try {
        recipe = await super.findOneBySlug(slug);
        //store.dispatch('addRecipe', recipe);
        return undefined; //store.getters.getRecipeBySlug(slug);
      } catch (e) {
        if (e instanceof DocumentNotFound) {
          return undefined;
        }
      }
    }
    return recipe;
  }

  async add(recipe: Recipe): Promise<null> {
    const newRecipe = await super.addOne(recipe);
    this.hydrate(newRecipe);
    return new Promise<null>(resolve => {
      resolve(null);
    });
    //store.dispatch('addRecipe', newRecipe);
    //return store.getters.getRecipe(newRecipe.slug);
  }

  async update(recipe: Recipe): Promise<void> {
    await super.updateOne(recipe);
    this.hydrate(recipe);
    //return store.dispatch('updateRecipe', recipe);
  }

  async delete(recipe: Recipe): Promise<void> {
    await super.removeOne(recipe);
    //return store.dispatch('deleteRecipe', recipe);
  }

  private hydrate(recipe: Recipe): void {
    recipe.recipeIngredients.forEach(recipeIngredient => {
      //recipeIngredient.ingredient = store.getters.getIngredientById(recipeIngredient.ingredientId);
      delete recipeIngredient.ingredientId;
    });
  }
}

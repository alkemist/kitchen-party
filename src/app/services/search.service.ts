import { Injectable } from '@angular/core';
import { RecipeTypeLabelEnum, RecipeTypes } from '../enums';
import { IngredientModel, RecipeModel } from '../models';
import { IngredientService } from './ingredient.service';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private ingredientService: IngredientService,
    private recipeService: RecipeService,
  ) {
  }

  async searchIngredientsOrRecipes(query: string): Promise<(RecipeModel | IngredientModel)[]> {
    const ingredients = await this.ingredientService.search(query);
    const recipes = (await this.recipeService.search(query))
      .filter((recipe: RecipeModel) => recipe.type && RecipeTypes.get(recipe.type) === RecipeTypeLabelEnum.ingredient);
    return ([] as (RecipeModel | IngredientModel)[]).concat(ingredients).concat(recipes);
  }
}

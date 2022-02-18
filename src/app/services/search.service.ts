import { Injectable } from '@angular/core';
import { RecipeTypeEnum, RecipeTypes } from '../enums/recipe-type.enum';
import { IngredientModel } from '../models/ingredient.model';
import { RecipeModel } from '../models/recipe.model';
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
    const ingredientsOrRecipes: (RecipeModel | IngredientModel)[] = [];
    const ingredients = await this.ingredientService.search(query);
    const recipes = (await this.recipeService.search(query))
      .filter((recipe: RecipeModel) => recipe.type && RecipeTypes[recipe.type] === RecipeTypeEnum.ingredient);
    return ingredientsOrRecipes.concat(ingredients).concat(recipes);
  }
}

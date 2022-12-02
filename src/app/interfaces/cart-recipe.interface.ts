import {RecipeInterface} from "./recipe.interface";

export interface CartRecipeInterface {
  id?: string,
  quantity?: number | null,
  recipe?: RecipeInterface,
  recipeId?: string,
}

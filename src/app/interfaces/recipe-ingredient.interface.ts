import {RecipeInterface} from './recipe.interface';
import {RelationIngredientInterface} from "@app/interfaces/relation-ingredient.interface";

export interface RecipeIngredientInterface extends RelationIngredientInterface {
  recipe?: RecipeInterface,
  recipeId?: string,

  optionCarne?: boolean,
  optionVege?: boolean,
  optionVegan?: boolean,
}

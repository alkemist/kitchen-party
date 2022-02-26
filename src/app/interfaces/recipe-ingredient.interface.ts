import { MeasureUnitKeyEnum } from '../enums';
import { HasIngredient } from './has-ingredient.interface';
import { IngredientInterface } from './ingredient.interface';
import { RecipeInterface } from './recipe.interface';

export interface RecipeIngredientInterface extends HasIngredient {
  id?: string,
  quantity?: number | null,
  measure?: string,
  unit?: MeasureUnitKeyEnum | null,

  ingredient?: IngredientInterface,
  ingredientId?: string,
  recipe?: RecipeInterface,
  recipeId?: string,

  optionCarne?: boolean,
  optionVege?: boolean,
  optionVegan?: boolean,
}

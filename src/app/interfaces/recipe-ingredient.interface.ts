import { MeasureUnitEnum } from '../enums/measure-unit.enum';
import { HasIngredient } from './has-ingredient.interface';
import { IngredientInterface } from './ingredient.interface';
import { RecipeInterface } from './recipe.interface';

export interface RecipeIngredientInterface extends HasIngredient {
  id?: string,
  quantity?: number | null,
  measure?: string,
  unit?: MeasureUnitEnum | null,

  ingredient?: IngredientInterface,
  ingredientId?: string,
  recipe?: RecipeInterface,
  recipeId?: string,

  optionCarne: boolean,
  optionVege: boolean,
  optionVegan: boolean,
}
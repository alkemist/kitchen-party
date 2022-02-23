import { MeasureUnitEnum } from '../enums';
import { IngredientModel, RecipeModel } from '../models';
import { RecipeIngredientInterface } from './recipe-ingredient.interface';

export interface RecipeIngredientFormInterface extends RecipeIngredientInterface {
  unitOrMeasure: MeasureUnitEnum | string;
  ingredientOrRecipe: IngredientModel | RecipeModel;
}

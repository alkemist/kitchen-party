import { MeasureUnitKeyEnum } from '@enums';
import { IngredientModel, RecipeModel } from '@models';
import { RecipeIngredientInterface } from './recipe-ingredient.interface';

export interface RecipeIngredientFormInterface extends RecipeIngredientInterface {
  unitOrMeasure?: MeasureUnitKeyEnum | string;
  ingredientOrRecipe?: IngredientModel | RecipeModel;
}

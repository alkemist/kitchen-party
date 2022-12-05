import { MeasureUnitKeyEnum } from '@enums';
import { IngredientModel, RecipeModel } from '@models';
import { RecipeIngredientInterface } from './recipe-ingredient.interface';
import { KeyLabelInterface } from '@app/interfaces/key-label.interface';

export interface RecipeIngredientFormInterface extends RecipeIngredientInterface {
  unitOrMeasure?: MeasureUnitKeyEnum | string | KeyLabelInterface;
  ingredientOrRecipe?: IngredientModel | RecipeModel;
}

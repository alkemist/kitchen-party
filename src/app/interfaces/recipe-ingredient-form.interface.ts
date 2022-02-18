import { MeasureUnitEnum } from '../enums/measure-unit.enum';
import { IngredientModel } from '../models/ingredient.model';
import { RecipeModel } from '../models/recipe.model';
import { RecipeIngredientInterface } from './recipe-ingredient.interface';

export interface RecipeIngredientFormInterface extends RecipeIngredientInterface {
  unitOrMeasure: MeasureUnitEnum | string;
  ingredientOrRecipe: IngredientModel | RecipeModel;
}
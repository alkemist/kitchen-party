import {MeasureUnitKeyEnum} from '@enums';
import {HasIngredient} from './has-ingredient.interface';
import {IngredientInterface} from './ingredient.interface';

export interface RelationIngredientInterface extends HasIngredient {
  id?: string,
  quantity?: number | null,
  measure?: string,
  unit?: MeasureUnitKeyEnum | null,

  ingredient?: IngredientInterface,
  ingredientId?: string,
}

import {MeasureUnitKeyEnum} from '@enums';
import {RelationIngredientInterface} from "@app/interfaces/relation-ingredient.interface";

export interface RelationIngredientFormInterface extends RelationIngredientInterface {
  unitOrMeasure?: MeasureUnitKeyEnum | string;
}

import {IngredientTypeKeyEnum} from '@enums';
import {DataObjectInterface} from './data-object.interface';

export interface IngredientInterface extends DataObjectInterface {
  monthBegin?: number | null,
  monthEnd?: number | null,

  type?: IngredientTypeKeyEnum | string,
  isLiquid?: boolean | null,
}

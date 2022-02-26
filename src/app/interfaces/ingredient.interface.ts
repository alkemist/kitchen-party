import { IngredientTypeKeyEnum } from '../enums';
import { DataObjectInterface } from './data-object.interface';

export interface IngredientInterface extends DataObjectInterface {
  id?: string,
  name: string,
  slug: string,

  monthBegin?: number | null,
  monthEnd?: number | null,

  type: IngredientTypeKeyEnum | string,
  isLiquid?: boolean | null,
}

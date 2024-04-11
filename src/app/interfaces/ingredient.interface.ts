import { IngredientTypeKeyEnum } from '@enums';
import { DataObjectInterface } from './data-object.interface';
import { DocumentFrontInterface } from '@alkemist/ngx-data-store';

export interface IngredientInterface extends DataObjectInterface {
  monthBegin?: number | null,
  monthEnd?: number | null,

  type?: IngredientTypeKeyEnum | string,
  isLiquid?: boolean | null,
}

export interface IngredientV2Interface extends DocumentFrontInterface {
  monthBegin?: number | null,
  monthEnd?: number | null,

  type?: IngredientTypeKeyEnum | string,
  isLiquid?: boolean | null,
}


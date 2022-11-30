import { IngredientModel } from '@models';
import { MeasureUnitKeyEnum } from '@enums';

export interface CartElement {
  inKitchen: boolean,
  ingredient?: IngredientModel,
  other?: string,

  quantities: { [key: string]: number },
  quantity: string,

  measure?: string,
  unit?: MeasureUnitKeyEnum | null,
}

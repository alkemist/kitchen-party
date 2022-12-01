import {IngredientModel} from '@models';

export interface CartIngredientFormInterface {
  id?: string,
  ingredient?: IngredientModel;
  other?: string;
  quantity: string;
}

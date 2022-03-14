import { IngredientModel } from '@models';

export interface CartElement {
  inKitchen: boolean,
  ingredient: IngredientModel,
  quantities: { [key: string]: number },
  quantity: string
}
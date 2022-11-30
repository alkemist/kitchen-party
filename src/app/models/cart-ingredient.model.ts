import { KitchenIngredientInterface } from '@interfaces';
import { RelationIngredientModel } from "./relation-ingredient.model";
import { CartIngredientInterface } from "@app/interfaces/cart-ingredient.interface";


export class CartIngredientModel extends RelationIngredientModel implements KitchenIngredientInterface {
  other?: string;
  checked: boolean;

  constructor(cartIngredient: CartIngredientInterface) {
    super(cartIngredient);
    this.other = cartIngredient.other ?? '';
    this.checked = cartIngredient.checked;
  }

  get name(): string | undefined {
    return this.ingredient?.name;
  }

}




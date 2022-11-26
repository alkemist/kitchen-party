import {KitchenIngredientInterface} from '@interfaces';
import {RelationIngredientModel} from "./relation-ingredient.model";
import {CartIngredientInterface} from "@app/interfaces/cart-ingredient.interface";


export class CartIngredientModel extends RelationIngredientModel implements KitchenIngredientInterface {
  other?: string;

  constructor(kitchenIngredient: CartIngredientInterface) {
    super(kitchenIngredient);
    this.other = kitchenIngredient.other ?? '';
  }

  get name(): string | undefined {
    return this.ingredient?.name;
  }

}




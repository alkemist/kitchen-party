import {CartIngredientInterface} from "@app/interfaces/cart-ingredient.interface";
import {IngredientModel} from "@app/models/ingredient.model";


export class CartIngredientModel implements CartIngredientInterface {
  id?: string;
  quantity: string;

  checked: boolean;

  other?: string;
  ingredient?: IngredientModel;
  ingredientId?: string;

  constructor(cartIngredient: CartIngredientInterface) {
    this.id = cartIngredient.id;
    this.quantity = cartIngredient.quantity;

    this.other = cartIngredient.other ?? '';
    this.checked = cartIngredient.checked;

    if (cartIngredient.ingredientId) {
      this.ingredientId = cartIngredient.ingredientId;
    }
    if (cartIngredient.ingredient) {
      this.ingredient = new IngredientModel(cartIngredient.ingredient);
    }
  }

  get name(): string | undefined {
    return this.ingredient?.name ?? this.other;
  }

  toString(): string {
    return this.ingredient?.name ?? '';
  }
}




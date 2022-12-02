import {CartIngredientFormInterface} from "@app/interfaces/cart-ingredient-form.interface";


export interface CartIngredientInterface extends CartIngredientFormInterface {
  slug?: string;

  ingredientId?: string;
}

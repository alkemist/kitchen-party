import { RecipeIngredientInterface } from './recipe-ingredient.interface';

export interface KitchenIngredientInterface extends RecipeIngredientInterface {
  slug?: string;
  name?: string;
}

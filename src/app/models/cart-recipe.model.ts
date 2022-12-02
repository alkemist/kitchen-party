import {CartRecipeInterface} from "@interfaces";
import {RecipeModel} from "@app/models/recipe.model";

export class CartRecipeModel implements CartRecipeInterface {
  id?: string;
  quantity: number | 0;

  recipe?: RecipeModel;
  recipeId?: string;

  constructor(cartRecipe: CartRecipeInterface) {
    this.id = cartRecipe.id ?? '';
    this.quantity = cartRecipe.quantity ?? 0;

    this.recipeId = cartRecipe.recipeId ?? '';

    if (cartRecipe.recipe) {
      this.recipe = new RecipeModel(cartRecipe.recipe);
    }
  }

  get name(): string | undefined {
    return this.recipe?.name;
  }

}




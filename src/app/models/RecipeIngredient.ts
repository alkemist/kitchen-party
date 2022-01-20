import {KitchenIngredient, KitchenIngredientInterface} from './KitchenIngredient';

export interface RecipeIngredientInterface extends KitchenIngredientInterface {
  isMain: boolean,
  isBase: boolean,
}

export class RecipeIngredient extends KitchenIngredient implements RecipeIngredientInterface {
  isMain: boolean;
  isBase: boolean;

  constructor(recipeIngredient: RecipeIngredientInterface) {
    super(recipeIngredient);
    delete this.id;

    this.isMain = recipeIngredient.isMain;
    this.isBase = recipeIngredient.isBase;
  }
}


import {KitchenIngredientInterface, KitchenIngredientModel} from './kitchen-ingredient.model';

export interface RecipeIngredientInterface extends KitchenIngredientInterface {
  isMain: boolean,
  isBase: boolean,
}

export class RecipeIngredientModel extends KitchenIngredientModel implements RecipeIngredientInterface {
  isMain: boolean;
  isBase: boolean;

  constructor(recipeIngredient: RecipeIngredientInterface) {
    super(recipeIngredient);
    delete this.id;

    this.isMain = recipeIngredient.isMain;
    this.isBase = recipeIngredient.isBase;
  }
}


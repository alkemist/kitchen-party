import {KitchenIngredientInterface, KitchenIngredientModel} from './kitchen-ingredient.model';
import {RecipeModel} from './recipe.model';

export interface RecipeIngredientInterface extends KitchenIngredientInterface {
  isMain: boolean,
  isBase: boolean,
  recipe?: RecipeModel,
  recipeId?: string,
}

export class RecipeIngredientModel extends KitchenIngredientModel implements RecipeIngredientInterface {
  isMain: boolean;
  isBase: boolean;
  recipe?: RecipeModel;
  recipeId?: string;

  constructor(recipeIngredient: RecipeIngredientInterface) {
    super(recipeIngredient);
    delete this.id;

    this.isMain = recipeIngredient.isMain;
    this.isBase = recipeIngredient.isBase;
    
    this.recipe = recipeIngredient.recipe;
    this.recipeId = recipeIngredient.recipeId;
  }

  override toString(): string {
    return '';
  }
}


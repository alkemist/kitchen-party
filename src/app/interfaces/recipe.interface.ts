import { RecipeTypeKeyEnum } from '@enums';
import { DataObjectInterface } from './data-object.interface';
import { RecipeIngredientInterface } from './recipe-ingredient.interface';
import { DocumentBackInterface, DocumentFrontInterface } from '@alkemist/ngx-data-store';

export interface RecipeInterface extends DataObjectInterface {
  cookingDuration?: number,
  preparationDuration?: number,
  waitingDuration?: number,

  nbSlices?: number,
  instructions?: string[],
  type?: RecipeTypeKeyEnum | null,
  image?: string,
  imagePath?: string,
  source?: string,

  recipeIngredients?: RecipeIngredientInterface[],
}

export interface RecipeV2FrontInterface extends DocumentFrontInterface {
  cookingDuration?: number,
  preparationDuration?: number,
  waitingDuration?: number,

  nbSlices?: number,
  instructions?: string[],
  type?: RecipeTypeKeyEnum | null,
  imageName?: string,
  source?: string,

  recipeIngredients?: RecipeIngredientInterface[],
}

export interface RecipeV2BackInterface extends DocumentBackInterface {
  cookingDuration?: number,
  preparationDuration?: number,
  waitingDuration?: number,

  nbSlices?: number,
  instructions?: string[],
  type?: RecipeTypeKeyEnum | null,
  imageName?: string,
  source?: string,

  recipeIngredients?: RecipeIngredientInterface[],
}

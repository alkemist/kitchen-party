import {RecipeTypeEnum} from "../enums/recipe-type.enum";
import {DataObjectInterface} from "./data-object.interface";
import {RecipeIngredientInterface} from "./recipe-ingredient.interface";

export interface RecipeInterface extends DataObjectInterface {
  id?: string,
  name: string,
  slug: string,

  cookingDuration?: number,
  preparationDuration?: number,
  waitingDuration?: number,

  nbSlices?: number,
  instructions?: string[],
  type?: RecipeTypeEnum | null,
  image?: string,
  imagePath?: string,
  source?: string,

  recipeIngredients: RecipeIngredientInterface[],
}
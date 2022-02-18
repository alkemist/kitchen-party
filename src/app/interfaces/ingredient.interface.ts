import {IngredientTypeEnum} from "../enums/ingredient-type.enum";
import {RecipeInterface} from "./recipe.interface";
import {DataObjectInterface} from "./data-object.interface";

export interface IngredientInterface extends DataObjectInterface {
  id?: string,
  name: string,
  slug: string,

  monthBegin?: number | null,
  monthEnd?: number | null,

  type: IngredientTypeEnum,
  isLiquid?: boolean | null,

  recipeId?: string,
  recipe?: RecipeInterface
}
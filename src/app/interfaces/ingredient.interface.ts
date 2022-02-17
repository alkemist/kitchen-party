import {DataObjectInterface} from "../services/firestore.service";
import {IngredientTypeEnum} from "../enums/ingredient-type.enum";
import {RecipeInterface} from "../models/recipe.model";

export interface IngredientInterface extends DataObject {
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

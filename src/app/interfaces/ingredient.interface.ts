import { IngredientTypeEnum } from '../enums/ingredient-type.enum';
import { DataObjectInterface } from './data-object.interface';
import { RecipeInterface } from './recipe.interface';

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

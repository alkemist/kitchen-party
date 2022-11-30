import { RelationIngredientInterface } from "@app/interfaces/relation-ingredient.interface";


export interface CartIngredientInterface extends RelationIngredientInterface {
  slug?: string;
  name?: string;
  other?: string;
  checked: boolean;
}

import {RelationIngredientInterface} from "@app/interfaces/relation-ingredient.interface";

export interface KitchenIngredientInterface extends RelationIngredientInterface {
  slug?: string;
  name?: string;
}

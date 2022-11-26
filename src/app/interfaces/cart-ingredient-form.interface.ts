import {IngredientModel} from '@models';
import {RelationIngredientFormInterface} from "@app/interfaces/relation-ingredient-form.interface";

export interface CartIngredientFormInterface extends RelationIngredientFormInterface {
  ingredientOrOther?: IngredientModel | string;
}

import { IngredientInterface } from './ingredient.interface';

export interface IngredientFormInterface extends IngredientInterface {
  dateBegin: Date;
  dateEnd: Date;
}

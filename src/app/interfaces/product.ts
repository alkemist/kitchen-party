import {IdentifiableInterface} from './Identifiable';
import {IngredientInterface} from './ingredient';

export interface ProductInterface extends IdentifiableInterface {
  quantity: number;
  ingredientId: number;
  ingredient: IngredientInterface;
}

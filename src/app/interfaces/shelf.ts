import {IdentifiableInterface} from './Identifiable';
import {IngredientInterface} from './ingredient';

export interface ShelfInterface extends IdentifiableInterface {
  name: string;
  quantity: number;
  ingredientId: number;
  ingredient: IngredientInterface;
}

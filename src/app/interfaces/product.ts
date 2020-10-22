import {IdentifiableInterface} from './Identifiable';
import {IngredientInterface} from './ingredient';

export interface productInterface extends IdentifiableInterface {
  name: string;
  quantity: number;
  ingredientId: number;
  ingredient: IngredientInterface;
}

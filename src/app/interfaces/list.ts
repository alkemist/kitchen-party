import {IdentifiableInterface} from './Identifiable';
import {IngredientInterface} from './ingredient';

export interface ListInterface extends IdentifiableInterface {
  name: string;
  ingredientIds: number[];
  ingredients: ListIngredientInterface[];
}

export interface ListIngredientInterface extends IdentifiableInterface {
  quantity: number;
  checked: boolean;
  listId: number;
  list: ListInterface;
  ingredientId: number;
  ingredient: IngredientInterface;
}

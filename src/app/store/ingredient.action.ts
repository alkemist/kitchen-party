import {Ingredient} from '../models/Ingredient';

export class AddIngredient {
  static readonly type = '[Ingredient] Add';

  constructor(public payload: Ingredient) {
  }
}

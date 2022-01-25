import {IngredientModel} from '../models/ingredient.model';

export class AddIngredient {
  static readonly type = '[Ingredient] Add';

  constructor(public payload: IngredientModel) {
  }
}

export class UpdateIngredient {
  static readonly type = '[Ingredient] Update';

  constructor(public payload: IngredientModel) {
  }
}

export class RemoveIngredient {
  static readonly type = '[Ingredient] Remove';

  constructor(public payload: IngredientModel) {
  }
}

export class FillIngredients {
  static readonly type = '[Ingredient] Fill';

  constructor(public payload: IngredientModel[]) {
  }
}

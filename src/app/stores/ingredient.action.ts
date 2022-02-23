import { IngredientInterface } from '../interfaces';

export class AddIngredient {
  static readonly type = '[Ingredient] Add';

  constructor(public payload: IngredientInterface) {
  }
}

export class UpdateIngredient {
  static readonly type = '[Ingredient] Update';

  constructor(public payload: IngredientInterface) {
  }
}

export class RemoveIngredient {
  static readonly type = '[Ingredient] Remove';

  constructor(public payload: IngredientInterface) {
  }
}

export class FillIngredients {
  static readonly type = '[Ingredient] Fill';

  constructor(public payload: IngredientInterface[]) {
  }
}

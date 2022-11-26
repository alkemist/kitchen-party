import {CartIngredientInterface} from '@interfaces';

export class AddCartIngredient {
  static readonly type = '[CartIngredient] Add';

  constructor(public payload: CartIngredientInterface) {
  }
}

export class UpdateCartIngredient {
  static readonly type = '[CartIngredient] Update';

  constructor(public payload: CartIngredientInterface) {
  }
}

export class RemoveCartIngredient {
  static readonly type = '[CartIngredient] Remove';

  constructor(public payload: CartIngredientInterface) {
  }
}

export class FillCartIngredients {
  static readonly type = '[CartIngredient] Fill';

  constructor(public payload: CartIngredientInterface[]) {
  }
}

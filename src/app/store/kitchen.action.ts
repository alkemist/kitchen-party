import {KitchenIngredientInterface} from "../models/kitchen-ingredient.model";

export class AddKitchenIngredient {
  static readonly type = '[KitchenIngredient] Add';

  constructor(public payload: KitchenIngredientInterface) {
  }
}

export class UpdateKitchenIngredient {
  static readonly type = '[KitchenIngredient] Update';

  constructor(public payload: KitchenIngredientInterface) {
  }
}

export class RemoveKitchenIngredient {
  static readonly type = '[KitchenIngredient] Remove';

  constructor(public payload: KitchenIngredientInterface) {
  }
}

export class FillKitchenIngredients {
  static readonly type = '[KitchenIngredient] Fill';

  constructor(public payload: KitchenIngredientInterface[]) {
  }
}

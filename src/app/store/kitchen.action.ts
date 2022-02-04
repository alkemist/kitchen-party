import {KitchenIngredientModel} from "../models/recipe-ingredient.model";

export class AddKitchenIngredient {
  static readonly type = '[KitchenIngredient] Add';

  constructor(public payload: KitchenIngredientModel) {
  }
}

export class UpdateKitchenIngredient {
  static readonly type = '[KitchenIngredient] Update';

  constructor(public payload: KitchenIngredientModel) {
  }
}

export class RemoveKitchenIngredient {
  static readonly type = '[KitchenIngredient] Remove';

  constructor(public payload: KitchenIngredientModel) {
  }
}

export class FillKitchenIngredients {
  static readonly type = '[KitchenIngredient] Fill';

  constructor(public payload: KitchenIngredientModel[]) {
  }
}

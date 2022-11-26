import {CartRecipeInterface} from '@interfaces';

export class AddCartRecipe {
  static readonly type = '[CartRecipe] Add';

  constructor(public payload: CartRecipeInterface) {
  }
}

export class UpdateCartRecipe {
  static readonly type = '[CartRecipe] Update';

  constructor(public payload: CartRecipeInterface) {
  }
}

export class RemoveCartRecipe {
  static readonly type = '[CartRecipe] Remove';

  constructor(public payload: CartRecipeInterface) {
  }
}

export class FillCartRecipes {
  static readonly type = '[CartRecipe] Fill';

  constructor(public payload: CartRecipeInterface[]) {
  }
}

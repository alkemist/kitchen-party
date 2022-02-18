import {RecipeInterface} from "../interfaces/recipe.interface";

export class AddRecipe {
  static readonly type = '[Recipe] Add';

  constructor(public payload: RecipeInterface) {
  }
}

export class UpdateRecipe {
  static readonly type = '[Recipe] Update';

  constructor(public payload: RecipeInterface) {
  }
}

export class RemoveRecipe {
  static readonly type = '[Recipe] Remove';

  constructor(public payload: RecipeInterface) {
  }
}

export class FillRecipes {
  static readonly type = '[Recipe] Fill';

  constructor(public payload: RecipeInterface[]) {
  }
}

import {RecipeModel} from '../models/recipe.model';

export class AddRecipe {
  static readonly type = '[Recipe] Add';

  constructor(public payload: RecipeModel) {
  }
}

export class UpdateRecipe {
  static readonly type = '[Recipe] Update';

  constructor(public payload: RecipeModel) {
  }
}

export class RemoveRecipe {
  static readonly type = '[Recipe] Remove';

  constructor(public payload: RecipeModel) {
  }
}

export class FillRecipes {
  static readonly type = '[Recipe] Fill';

  constructor(public payload: RecipeModel[]) {
  }
}

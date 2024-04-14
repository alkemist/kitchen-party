import { StateAction } from "@alkemist/ngx-state-manager";
import { RecipeInterface } from "@app/interfaces";

export class RecipeFillPublicAction extends StateAction<RecipeInterface[]> {
  static override readonly key = "Fill public";

  constructor(public payload: RecipeInterface[]) {
    super();
  }
}

export class RecipeFillUserAction extends StateAction<RecipeInterface[]> {
  static override readonly key = "Fill user";

  constructor(public payload: RecipeInterface[]) {
    super();
  }
}

export class RecipeGetAction extends StateAction<RecipeInterface> {
  static override readonly key = "Get";

  constructor(public payload: RecipeInterface) {
    super();
  }
}

export class RecipeAddAction extends StateAction<RecipeInterface> {
  static override readonly key = "Add";

  constructor(public payload: RecipeInterface) {
    super();
  }
}

export class RecipeUpdateAction extends StateAction<RecipeInterface> {
  static override readonly key = "Update";

  constructor(public payload: RecipeInterface) {
    super();
  }
}

export class RecipeDeleteAction extends StateAction<RecipeInterface> {
  static override readonly key = "Delete";

  constructor(public payload: RecipeInterface) {
    super();
  }
}

export class RecipeResetAction extends StateAction<void> {
  static override readonly key = "Reset";

  constructor(public payload: void) {
    super();
  }
}

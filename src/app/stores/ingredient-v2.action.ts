import { StateAction } from "@alkemist/ngx-state-manager";
import { IngredientInterface } from "@app/interfaces";

export class IngredientFillAction extends StateAction<IngredientInterface[]> {
  static override readonly key = "Fill";

  constructor(public payload: IngredientInterface[]) {
    super();
  }
}

export class IngredientGetAction extends StateAction<IngredientInterface> {
  static override readonly key = "Get";

  constructor(public payload: IngredientInterface) {
    super();
  }
}

export class IngredientAddAction extends StateAction<IngredientInterface> {
  static override readonly key = "Add";

  constructor(public payload: IngredientInterface) {
    super();
  }
}

export class IngredientUpdateAction extends StateAction<IngredientInterface> {
  static override readonly key = "Update";

  constructor(public payload: IngredientInterface) {
    super();
  }
}

export class IngredientDeleteAction extends StateAction<IngredientInterface> {
  static override readonly key = "Delete";

  constructor(public payload: IngredientInterface) {
    super();
  }
}

export class IngredientResetAction extends StateAction<void> {
  static override readonly key = "Reset";

  constructor(public payload: void) {
    super();
  }
}

import {Injectable} from '@angular/core';
import {CartIngredientInterface} from '@interfaces';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {append, patch, removeItem, updateItem} from '@ngxs/store/operators';
import {
  AddCartIngredient,
  FillCartIngredients,
  RemoveCartIngredient,
  UpdateCartIngredient
} from './cart-ingredient.action';

export class CartIngredientStateModel {
  all: CartIngredientInterface[] = [];
  lastUpdated?: Date = undefined;
}

@Injectable()
@State<CartIngredientStateModel>({
  name: 'cartIngredients',
  defaults: {
    all: [],
    lastUpdated: undefined,
  }
})
export class CartIngredientState {

  @Selector()
  static lastUpdated(state: CartIngredientStateModel): Date | undefined {
    return state.lastUpdated;
  }

  @Selector()
  static all(state: CartIngredientStateModel): CartIngredientInterface[] {
    return state.all;
  }

  @Selector()
  static getCartIngredientBySlug(state: CartIngredientStateModel, slug: string) {
    return state.all.find((cartIngredient: CartIngredientInterface) => {
      return cartIngredient.ingredient?.slug === slug;
    });
  }

  @Action(FillCartIngredients)
  fill({getState, patchState}: StateContext<CartIngredientStateModel>, {payload}: FillCartIngredients) {
    patchState({
      all: payload,
      lastUpdated: new Date()
    });
  }

  @Action(AddCartIngredient)
  add({setState}: StateContext<CartIngredientStateModel>, {payload}: AddCartIngredient) {
    setState(
      patch({
        all: append([payload])
      })
    );
  }

  @Action(RemoveCartIngredient)
  remove({setState}: StateContext<CartIngredientStateModel>, {payload}: RemoveCartIngredient) {
    setState(
      patch({
        all: removeItem<CartIngredientInterface>((item?: CartIngredientInterface) => item?.id === payload.id)
      })
    );
  }

  @Action(UpdateCartIngredient)
  update({
           getState,
           patchState,
           setState
         }: StateContext<CartIngredientStateModel>, {payload}: UpdateCartIngredient) {
    setState(
      patch({
        all: updateItem<CartIngredientInterface>((item?: CartIngredientInterface) => item?.id === payload.id, payload)
      })
    );
  }
}

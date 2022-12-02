import {Injectable} from '@angular/core';
import {CartRecipeInterface} from '@interfaces';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {append, patch, removeItem, updateItem} from '@ngxs/store/operators';
import {AddCartRecipe, FillCartRecipes, RemoveCartRecipe, UpdateCartRecipe} from './cart-recipe.action';

export class CartRecipeStateModel {
  all: CartRecipeInterface[] = [];
  lastUpdated?: Date = undefined;
}

@Injectable()
@State<CartRecipeStateModel>({
  name: 'cartRecipes',
  defaults: {
    all: [],
    lastUpdated: undefined,
  }
})
export class CartRecipeState {

  @Selector()
  static lastUpdated(state: CartRecipeStateModel): Date | undefined {
    return state.lastUpdated;
  }

  @Selector()
  static all(state: CartRecipeStateModel): CartRecipeInterface[] {
    return state.all;
  }

  @Selector()
  static getCartRecipeBySlug(state: CartRecipeStateModel, slug: string) {
    return state.all.find((cartRecipe: CartRecipeInterface) => {
      return cartRecipe.recipe?.slug === slug;
    });
  }

  @Action(FillCartRecipes)
  fill({getState, patchState}: StateContext<CartRecipeStateModel>, {payload}: FillCartRecipes) {
    patchState({
      all: payload,
      lastUpdated: new Date()
    });
  }

  @Action(AddCartRecipe)
  add({setState}: StateContext<CartRecipeStateModel>, {payload}: AddCartRecipe) {
    setState(
      patch({
        all: append([payload])
      })
    );
  }

  @Action(RemoveCartRecipe)
  remove({setState}: StateContext<CartRecipeStateModel>, {payload}: RemoveCartRecipe) {
    setState(
      patch({
        all: removeItem<CartRecipeInterface>((item?: CartRecipeInterface) => item?.id === payload.id)
      })
    );
  }

  @Action(UpdateCartRecipe)
  update({
           getState,
           patchState,
           setState
         }: StateContext<CartRecipeStateModel>, {payload}: UpdateCartRecipe) {
    setState(
      patch({
        all: updateItem<CartRecipeInterface>((item?: CartRecipeInterface) => item?.id === payload.id, payload)
      })
    );
  }
}

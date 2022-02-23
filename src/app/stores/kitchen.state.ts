import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { KitchenIngredientInterface } from '../interfaces';
import {
  AddKitchenIngredient,
  FillKitchenIngredients,
  RemoveKitchenIngredient,
  UpdateKitchenIngredient
} from './kitchen.action';

export class KitchenIngredientStateModel {
  all: KitchenIngredientInterface[] = [];
  lastUpdated?: Date = undefined;
}

@Injectable()
@State<KitchenIngredientStateModel>({
  name: 'kitchenIngredients',
  defaults: {
    all: [],
    lastUpdated: undefined,
  }
})
export class KitchenIngredientState {

  @Selector()
  static lastUpdated(state: KitchenIngredientStateModel): Date | undefined {
    return state.lastUpdated;
  }

  @Selector()
  static all(state: KitchenIngredientStateModel): KitchenIngredientInterface[] {
    return state.all;
  }

  @Selector()
  static getKitchenIngredientBySlug(state: KitchenIngredientStateModel, slug: string) {
    return state.all.find((kitchenIngredient: KitchenIngredientInterface) => {
      return kitchenIngredient.ingredient?.slug === slug;
    });
  }

  @Action(FillKitchenIngredients)
  fill({ getState, patchState }: StateContext<KitchenIngredientStateModel>, { payload }: FillKitchenIngredients) {
    patchState({
      all: payload,
      lastUpdated: new Date()
    });
  }

  @Action(AddKitchenIngredient)
  add({ setState }: StateContext<KitchenIngredientStateModel>, { payload }: AddKitchenIngredient) {
    setState(
      patch({
        all: append([ payload ])
      })
    );
  }

  @Action(RemoveKitchenIngredient)
  remove({ setState }: StateContext<KitchenIngredientStateModel>, { payload }: RemoveKitchenIngredient) {
    setState(
      patch({
        all: removeItem<KitchenIngredientInterface>((item?: KitchenIngredientInterface) => item?.id === payload.id)
      })
    );
  }

  @Action(UpdateKitchenIngredient)
  update({
           getState,
           patchState,
           setState
         }: StateContext<KitchenIngredientStateModel>, { payload }: UpdateKitchenIngredient) {
    setState(
      patch({
        all: updateItem<KitchenIngredientInterface>((item?: KitchenIngredientInterface) => item?.id === payload.id, payload)
      })
    );
  }
}

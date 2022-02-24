import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { IngredientTypeEnum, IngredientTypes } from '../enums';
import { IngredientInterface } from '../interfaces';
import { AddIngredient, FillIngredients, RemoveIngredient, UpdateIngredient } from './ingredient.action';

export interface IngredientStateInterface {
  all: IngredientInterface[];
  lastUpdated?: Date;
}

@Injectable()
@State<IngredientStateInterface>({
  name: 'ingredients',
  defaults: {
    all: [],
    lastUpdated: undefined,
  }
})
export class IngredientState {

  @Selector()
  static lastUpdated(state: IngredientStateInterface): Date | undefined {
    return state.lastUpdated;
  }

  @Selector()
  static all(state: IngredientStateInterface): IngredientInterface[] {
    return state.all;
  }

  @Selector()
  static fruitsOrVegetables(state: IngredientStateInterface): IngredientInterface[] {
    return state.all.filter(ingredient =>
      IngredientTypes[ingredient.type] === IngredientTypeEnum.fruits_vegetables_mushrooms
      && ingredient.monthBegin && ingredient.monthEnd
    );
  }

  @Selector()
  static getIngredientBySlug(state: IngredientStateInterface, slug: string) {
    return state.all.find((ingredient: IngredientInterface) => {
      return ingredient.slug === slug;
    });
  }

  @Action(FillIngredients)
  fill({ getState, patchState }: StateContext<IngredientStateInterface>, { payload }: FillIngredients) {
    patchState({
      all: payload,
      lastUpdated: new Date()
    });
  }

  @Action(AddIngredient)
  add({ setState }: StateContext<IngredientStateInterface>, { payload }: AddIngredient) {
    setState(
      patch({
        all: append([ payload ])
      })
    );
  }

  @Action(RemoveIngredient)
  remove({ setState }: StateContext<IngredientStateInterface>, { payload }: RemoveIngredient) {
    setState(
      patch({
        all: removeItem<IngredientInterface>((item?: IngredientInterface) => item?.id === payload.id)
      })
    );
  }

  @Action(UpdateIngredient)
  update({ getState, patchState, setState }: StateContext<IngredientStateInterface>, { payload }: UpdateIngredient) {
    setState(
      patch({
        all: updateItem<IngredientInterface>((item?: IngredientInterface) => item?.id === payload.id, payload)
      })
    );
  }
}

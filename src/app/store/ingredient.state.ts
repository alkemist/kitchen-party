import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {append, patch, removeItem, updateItem} from '@ngxs/store/operators';
import {IngredientModel} from '../models/ingredient.model';
import {AddIngredient, FillIngredients, RemoveIngredient, UpdateIngredient} from './ingredient.action';

export class IngredientStateModel {
  all: IngredientModel[] = [];
}

@Injectable()
@State<IngredientStateModel>({
  name: 'ingredients',
  defaults: {
    all: []
  }
})
export class IngredientState {

  @Selector()
  static getIngredients(state: IngredientStateModel) {
    return state.all;
  }

  @Action(FillIngredients)
  fill({getState, patchState}: StateContext<IngredientStateModel>, {payload}: FillIngredients) {
    patchState({
      all: payload
    });
  }

  @Action(AddIngredient)
  add({setState}: StateContext<IngredientStateModel>, {payload}: AddIngredient) {
    setState(
      patch({
        all: append([payload])
      })
    );
  }

  @Action(RemoveIngredient)
  remove({setState}: StateContext<IngredientStateModel>, {payload}: RemoveIngredient) {
    setState(
      patch({
        all: removeItem<IngredientModel>((item?: IngredientModel) => item?.id === payload.id)
      })
    );
  }

  @Action(UpdateIngredient)
  update({getState, patchState, setState}: StateContext<IngredientStateModel>, {payload}: UpdateIngredient) {
    setState(
      patch({
        all: updateItem<IngredientModel>((item?: IngredientModel) => item?.id === payload.id, payload)
      })
    );
  }
}

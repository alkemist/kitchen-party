import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Ingredient} from '../models/Ingredient';
import {AddIngredient} from './ingredient.action';

export class IngredientStateModel {
  ingredients: Ingredient[] = [];
}

@Injectable()
@State<IngredientStateModel>({
  name: 'ingredients',
  defaults: {
    ingredients: []
  }
})
export class IngredientState {

  @Selector()
  static getIngredients(state: IngredientStateModel) {
    return state.ingredients;
  }

  @Action(AddIngredient)
  add({getState, patchState}: StateContext<IngredientStateModel>, {payload}: AddIngredient) {
    const state = getState();
    patchState({
      ingredients: [...state.ingredients, payload]
    });
  }
}

import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {append, patch, removeItem, updateItem} from '@ngxs/store/operators';
import {RecipeModel} from '../models/recipe.model';
import {AddRecipe, FillRecipes, RemoveRecipe, UpdateRecipe} from './recipe.action';

export class RecipeStateModel {
  all: RecipeModel[] = [];
}

@Injectable()
@State<RecipeStateModel>({
  name: 'recipes',
  defaults: {
    all: []
  }
})
export class RecipeState {

  @Selector()
  static getRecipes(state: RecipeStateModel) {
    return state.all;
  }

  @Action(FillRecipes)
  fill({getState, patchState}: StateContext<RecipeStateModel>, {payload}: FillRecipes) {
    patchState({
      all: payload
    });
  }

  @Action(AddRecipe)
  add({setState}: StateContext<RecipeStateModel>, {payload}: AddRecipe) {
    setState(
      patch({
        all: append([payload])
      })
    );
  }

  @Action(RemoveRecipe)
  remove({setState}: StateContext<RecipeStateModel>, {payload}: RemoveRecipe) {
    setState(
      patch({
        all: removeItem<RecipeModel>((item?: RecipeModel) => item?.id === payload.id)
      })
    );
  }

  @Action(UpdateRecipe)
  update({getState, patchState, setState}: StateContext<RecipeStateModel>, {payload}: UpdateRecipe) {
    setState(
      patch({
        all: updateItem<RecipeModel>((item?: RecipeModel) => item?.id === payload.id, payload)
      })
    );
  }
}

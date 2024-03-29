import { Injectable } from '@angular/core';
import { KeyLabelInterface, RecipeInterface } from '@interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { AddRecipe, FillRecipes, RemoveRecipe, UpdateRecipe } from './recipe.action';

export class RecipeStateModel {
  all: RecipeInterface[] = [];
  customMeasures: string[] = [];
  lastUpdated?: Date = undefined;
}

@Injectable()
@State<RecipeStateModel>({
  name: 'recipes',
  defaults: {
    all: [],
    customMeasures: [],
    lastUpdated: undefined,
  }
})
export class RecipeState {

  @Selector()
  static lastUpdated(state: RecipeStateModel): Date | undefined {
    return state.lastUpdated;
  }

  @Selector()
  static all(state: RecipeStateModel): RecipeInterface[] {
    return state.all;
  }

  @Selector()
  static customMeasure(state: RecipeStateModel): KeyLabelInterface[] {
    let measures = state.all.map(recipe => {
      return recipe.recipeIngredients?.map(recipeIngredient => recipeIngredient.measure);
    });
    const uniqueMeasures = measures.flat().filter((value, index, self) => {
      return value && self.indexOf(value) === index;
    });
    return uniqueMeasures.map(measure => {
      return {
        key: measure!,
        label: measure!
      };
    });
  }

  @Action(FillRecipes)
  fill({getState, patchState}: StateContext<RecipeStateModel>, {payload}: FillRecipes) {
    patchState({
      all: payload,
      lastUpdated: new Date()
    });
  }

  @Action(AddRecipe)
  add({setState}: StateContext<RecipeStateModel>, {payload}: AddRecipe) {
    setState(
      patch({
        all: append([ payload ])
      })
    );
  }

  @Action(RemoveRecipe)
  remove({setState}: StateContext<RecipeStateModel>, {payload}: RemoveRecipe) {
    setState(
      patch({
        all: removeItem<RecipeInterface>((item?: RecipeInterface) => item?.id === payload.id)
      })
    );
  }

  @Action(UpdateRecipe)
  update({getState, patchState, setState}: StateContext<RecipeStateModel>, {payload}: UpdateRecipe) {
    setState(
      patch({
        all: updateItem<RecipeInterface>((item?: RecipeInterface) => item?.id === payload.id, payload)
      })
    );
  }
}

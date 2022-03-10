import { Injectable } from '@angular/core';
import { KeyValueInterface } from '@interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { FillTranslations } from './translation.action';


export class TranslationStateModel {
  all: KeyValueInterface[] = [];
  lastUpdated?: Date = undefined;
}

@Injectable()
@State<TranslationStateModel>({
  name: 'translations',
  defaults: {
    all: [],
    lastUpdated: undefined,
  }
})
export class TranslationState {

  @Selector()
  static lastUpdated(state: TranslationStateModel): Date | undefined {
    return state.lastUpdated;
  }

  @Selector()
  static all(state: TranslationStateModel): KeyValueInterface[] {
    return state.all;
  }

  @Action(FillTranslations)
  fill({getState, patchState}: StateContext<TranslationStateModel>, {payload}: FillTranslations) {
    patchState({
      all: payload,
      lastUpdated: new Date()
    });
  }
}

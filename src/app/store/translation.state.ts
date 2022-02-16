import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {FillTranslations} from "./translation.action";

export interface Translation {
  key: string,
  value: string
}

export class TranslationStateModel {
  all: Translation[] = [];
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
  static all(state: TranslationStateModel): Translation[] {
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

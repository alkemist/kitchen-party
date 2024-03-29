import { Injectable } from '@angular/core';
import { UserInterface } from '@interfaces';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { UserLogin, UserLogout } from './user.action';

export class UserStateModel {
  logged: UserInterface | undefined = undefined;
}

@Injectable()
@State<UserStateModel>({
  name: 'users',
  defaults: {
    logged: undefined
  }
})
export class UserState {

  @Selector()
  static getLoggedUser(state: UserStateModel) {
    return state.logged;
  }

  @Action(UserLogin)
  login({getState, patchState}: StateContext<UserStateModel>, {payload}: UserLogin) {
    patchState({
      logged: payload
    });
  }

  @Action(UserLogout)
  logout({patchState}: StateContext<UserStateModel>) {
    patchState({
      logged: undefined
    });
  }
}

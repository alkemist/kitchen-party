import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {UserLogin, UserLogout} from './user.action';
import {UserInterface} from "../interfaces/user.interface";

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

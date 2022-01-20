import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {User} from 'firebase/auth';
import {UserLogin, UserLogout} from './user.action';

export class UserStateModel {
  loggedUser: User | undefined = undefined;
}

@Injectable()
@State<UserStateModel>({
  name: 'user',
  defaults: {
    loggedUser: undefined
  }
})
export class UserState {

  @Selector()
  static getLoggedUser(state: UserStateModel) {
    return state.loggedUser;
  }

  @Action(UserLogin)
  login({getState, patchState}: StateContext<UserStateModel>, {payload}: UserLogin) {
    patchState({
      loggedUser: payload
    });
  }

  @Action(UserLogout)
  logout({patchState}: StateContext<UserStateModel>) {
    patchState({
      loggedUser: undefined
    });
  }
}

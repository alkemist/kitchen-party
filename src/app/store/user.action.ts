import {UserInterface} from "./user.state";

export class UserLogin {
  static readonly type = '[User] Login';

  constructor(public payload: UserInterface) {
  }
}

export class UserLogout {
  static readonly type = '[User] Logout';

  constructor() {
  }
}

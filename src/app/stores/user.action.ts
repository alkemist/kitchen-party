import { UserInterface } from '@interfaces';

export class UserLogin {
  static readonly type = '[User] Login';

  constructor(public payload: UserInterface | undefined) {
  }
}

export class UserLogout {
  static readonly type = '[User] Logout';

  constructor() {
  }
}

import {User} from 'firebase/auth';

export class UserLogin {
  static readonly type = '[User] Login';

  constructor(public payload: User) {
  }
}

export class UserLogout {
  static readonly type = '[User] Logout';

  constructor() {
  }
}

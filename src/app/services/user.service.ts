import { Injectable } from '@angular/core';
import { InvalidEmailError, OfflineError, TooManyRequestError, WrongApiKeyError, WrongPasswordError } from '@errors';
import { UserInterface } from '@interfaces';
import { Store } from '@ngxs/store';
import { UserLogin, UserLogout } from '@stores';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth = getAuth();

  constructor(private store: Store) {

  }

  get loggedUser(): Observable<User> {
    return this.store.selectOnce<User>(state => state.users.loggedUser);
  }

  getLoggedUser(event?: (user?: UserInterface) => void): Promise<UserInterface | undefined> {
    return new Promise<UserInterface | undefined>((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (userFirebase) => {
        const user: UserInterface | undefined = userFirebase ? {
          email: userFirebase.email,
        } : undefined;

        if (!event) {
          unsubscribe();
        } else {
          return event(user);
        }

        if (!userFirebase) {
          this.store.dispatch(new UserLogout());
          resolve(undefined);
        }

        this.store.dispatch(new UserLogin(user));
        resolve(user);
      });
    });
  }

  async login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {

      })
      .catch((error) => {
        if (error.code === 'auth/invalid-email') {
          throw new InvalidEmailError();
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          throw new WrongPasswordError();
        } else if (error.code === 'auth/too-many-requests') {
          throw new TooManyRequestError();
        } else if (error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
          throw new WrongApiKeyError();
        } else if (error.code === 'auth/network-request-failed') {
          throw new OfflineError();
        } else {
          console.error('Unknown error code', error.code);
        }
      });
  }

  async logout(): Promise<void> {
    return new Promise(resolve => {
      signOut(this.auth).then(() => {
        this.store.dispatch(new UserLogout());
        resolve();
      });
    });
  }
}

import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User} from 'firebase/auth';
import {Observable} from 'rxjs';
import {UserLogin, UserLogout} from '../store/user.action';
import {OfflineError, TooManyRequestError} from './firestore.service';
import {LoggedError} from "./logger.service";
import {UserInterface} from "../store/user.state";

export class InvalidEmailError extends Error {
  override message = 'Invalid email';
}

export class WrongPasswordError extends Error {
  override message = 'Wrong password';
}

export class WrongApiKeyError extends LoggedError<void> {
  override message = 'Wrong Api Key';
}

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
        const userData = userFirebase as unknown as UserInterface;
        const user: UserInterface = {
          email: userData.email!,
          createdAt: userData.createdAt!,
          lastLoginAt: userData.lastLoginAt!,
        };

        if (!event) {
          unsubscribe();
        } else {
          return event(userData ? user : undefined);
        }

        if (!userData) {
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
    return signOut(this.auth).then(() => {
      this.store.dispatch(new UserLogout());
    });
  }
}

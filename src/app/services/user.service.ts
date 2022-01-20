import {Injectable} from '@angular/core';
import {Store} from '@ngxs/store';
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User} from 'firebase/auth';
import {Observable} from 'rxjs';
import {UserLogin, UserLogout} from '../store/user.action';
import {OfflineError, TooManyRequestError} from './firestore.service';

export class InvalidEmailError extends Error {
  override message = 'Invalid email';
}

export class WrongPasswordError extends Error {
  override message = 'Wrong password';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth = getAuth();

  constructor(private store: Store) {

  }

  get loggedUser(): Observable<User> {
    return this.store.selectOnce<User>(state => state.user.loggedUser);
  }

  getLoggedUser(event?: (user?: User) => void): Promise<User | undefined> {
    return new Promise<User | undefined>((resolve) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        if (!event) {
          unsubscribe();
        } else {
          return event(user ? user : undefined);
        }

        if (!user) {
          this.store.dispatch(new UserLogout());
          resolve(undefined);
        }
        this.store.dispatch(new UserLogin(user as User));
        resolve(user as User);
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

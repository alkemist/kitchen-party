import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { NgxsModule, Store } from '@ngxs/store';
import { UserState } from '../stores/user.state';

jest.mock('firebase/auth', () => ({
  ...(jest.requireActual('firebase/auth')),
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ UserState ], {
          developmentMode: true
        })
      ]
    });
    service = TestBed.inject(UserService);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

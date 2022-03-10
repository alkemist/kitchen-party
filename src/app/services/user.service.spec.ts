import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';

import { UserService } from '@services';
import { UserState } from '@stores';

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

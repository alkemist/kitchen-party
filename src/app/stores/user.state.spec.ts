import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { UserLogin } from './user.action';
import { UserState } from './user.state';

describe('UserState', () => {
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ UserState ], {
          developmentMode: true
        })
      ],
    });

    store = TestBed.inject(Store);
  });

  describe('UserState.login', () => {
    beforeEach(async () => {
      store.dispatch(new UserLogin(undefined));
    });

    it('should fill users', () => {
      const usersSelected = store.selectSnapshot((state) => state.users.logged);
      expect(usersSelected).toEqual(undefined);
    });
  });
});

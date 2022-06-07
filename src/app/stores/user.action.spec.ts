import { UserInterface } from '@interfaces';
import { UserLogin, UserLogout } from './user.action';

describe('UserLogin', () => {
  describe('UserLogin.constructor', () => {
    it('should construct', () => {
      expect(new UserLogin({} as unknown as UserInterface)).toBeDefined();
      expect(new UserLogin(undefined)).toBeDefined();
    });
  });
});

describe('UserLogout', () => {
  describe('UserLogout.constructor', () => {
    it('should construct', () => {
      expect(new UserLogout()).toBeDefined();
    });
  });
});
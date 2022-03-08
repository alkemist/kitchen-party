import { WrongPasswordError } from './wrong-password.error';

describe('WrongPasswordError', () => {
  describe('WrongPasswordError.constructor', function () {
    it('should construct', () => {
      expect(new WrongPasswordError()).toBeDefined();
    });
  });
});
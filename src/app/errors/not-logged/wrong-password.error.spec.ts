import { WrongPasswordError } from '@errors';

describe('WrongPasswordError', () => {
  describe('WrongPasswordError.constructor', function () {
    it('should construct', () => {
      expect(new WrongPasswordError()).toBeDefined();
    });
  });
});
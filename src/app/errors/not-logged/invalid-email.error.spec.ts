import { InvalidEmailError } from './invalid-email.error';

describe('InvalidEmailError', () => {
  describe('InvalidEmailError.constructor', function () {
    it('should construct', () => {
      expect(new InvalidEmailError()).toBeDefined();
    });
  });
});
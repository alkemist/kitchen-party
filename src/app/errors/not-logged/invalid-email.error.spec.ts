import { InvalidEmailError } from '@app/errors';

describe('InvalidEmailError', () => {
  describe('InvalidEmailError.constructor', function () {
    it('should construct', () => {
      expect(new InvalidEmailError()).toBeDefined();
    });
  });
});
import { LoggedError } from '@errors';

describe('LoggedError', () => {
  describe('LoggedError.constructor', function () {
    it('should construct', () => {
      expect(new LoggedError()).toBeDefined();
    });
  });
});
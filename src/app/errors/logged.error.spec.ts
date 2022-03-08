import { LoggedError } from './logged.error';

describe('LoggedError', () => {
  describe('LoggedError.constructor', function () {
    it('should construct', () => {
      expect(new LoggedError()).toBeDefined();
    });
  });
});
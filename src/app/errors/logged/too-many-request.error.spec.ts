import { QuotaExceededError } from '@errors';

describe('QuotaExceededError', () => {
  describe('QuotaExceededError.constructor', function () {
    it('should construct', () => {
      expect(new QuotaExceededError()).toBeDefined();
    });
  });
});
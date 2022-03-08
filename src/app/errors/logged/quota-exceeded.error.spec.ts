import { QuotaExceededError } from './quota-exceeded.error';

describe('QuotaExceededError', () => {
  describe('QuotaExceededError.constructor', function () {
    it('should construct', () => {
      expect(new QuotaExceededError()).toBeDefined();
    });
  });
});
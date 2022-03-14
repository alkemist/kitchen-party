import { OfflineError } from '@app/errors';

describe('OfflineError', () => {
  describe('OfflineError.constructor', function () {
    it('should construct', () => {
      expect(new OfflineError()).toBeDefined();
    });
  });
});
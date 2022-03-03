import { OfflineError } from './offline.error';

describe('OfflineError', () => {
  describe('OfflineError.constructor', function () {
    it('should construct', () => {
      expect(new OfflineError()).toBeDefined();
    });
  });
});
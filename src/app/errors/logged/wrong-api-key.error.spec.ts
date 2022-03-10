import { WrongApiKeyError } from '@errors';

describe('WrongApiKeyError', () => {
  describe('WrongApiKeyError.constructor', function () {
    it('should construct', () => {
      expect(new WrongApiKeyError()).toBeDefined();
    });
  });
});
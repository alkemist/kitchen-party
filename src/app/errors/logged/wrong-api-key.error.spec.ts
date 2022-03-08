import { WrongApiKeyError } from './wrong-api-key.error';

describe('WrongApiKeyError', () => {
  describe('WrongApiKeyError.constructor', function () {
    it('should construct', () => {
      expect(new WrongApiKeyError()).toBeDefined();
    });
  });
});
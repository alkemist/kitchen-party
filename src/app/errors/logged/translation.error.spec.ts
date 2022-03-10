import { TranslationError } from '@errors';

describe('TranslationError', () => {
  describe('TranslationError.constructor', function () {
    it('should construct', () => {
      expect(new TranslationError('context')).toBeDefined();
    });
  });
});
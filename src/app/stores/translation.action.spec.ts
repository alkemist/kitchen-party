import { FillTranslations } from './translation.action';

describe('FillTranslations', () => {
  describe('FillTranslations.constructor', function () {
    it('should construct', () => {
      expect(new FillTranslations([])).toBeDefined();
    });
  });
});
import { FillTranslations } from './translation.action';

describe('FillTranslations', () => {
  describe('FillTranslations.constructor', () => {
    it('should construct', () => {
      expect(new FillTranslations([])).toBeDefined();
    });
  });
});
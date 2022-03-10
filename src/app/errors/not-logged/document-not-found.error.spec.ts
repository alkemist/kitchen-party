import { DocumentNotFoundError } from '@errors';

describe('DocumentNotFoundError', () => {
  describe('DocumentNotFoundError.constructor', function () {
    it('should construct', () => {
      expect(new DocumentNotFoundError('collectionName', {id: 'id'})).toBeDefined();
    });
  });
});
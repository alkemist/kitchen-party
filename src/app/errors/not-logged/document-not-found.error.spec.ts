import { DocumentNotFoundError } from './document-not-found.error';

describe('DocumentNotFoundError', () => {
  describe('DocumentNotFoundError.constructor', function () {
    it('should construct', () => {
      expect(new DocumentNotFoundError('collectionName', {id: 'id'})).toBeDefined();
    });
  });
});
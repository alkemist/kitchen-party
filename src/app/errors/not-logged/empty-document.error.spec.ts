import { EmptyDocumentError } from '@errors';

describe('EmptyDocumentError', () => {
  describe('EmptyDocumentError.constructor', function () {
    it('should construct', () => {
      expect(new EmptyDocumentError('collectionName')).toBeDefined();
    });
  });
});
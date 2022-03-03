import { EmptyDocumentError } from './empty-document.error';

describe('EmptyDocumentError', () => {
  describe('EmptyDocumentError.constructor', function () {
    it('should construct', () => {
      expect(new EmptyDocumentError('collectionName')).toBeDefined();
    });
  });
});
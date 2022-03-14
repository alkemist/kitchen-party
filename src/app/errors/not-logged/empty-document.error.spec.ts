import { EmptyDocumentError } from '@app/errors';

describe('EmptyDocumentError', () => {
  describe('EmptyDocumentError.constructor', function () {
    it('should construct', () => {
      expect(new EmptyDocumentError('collectionName')).toBeDefined();
    });
  });
});
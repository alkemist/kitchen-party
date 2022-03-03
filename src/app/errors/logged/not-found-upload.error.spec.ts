import { NotFoundUploadError } from './not-found-upload.error';

describe('NotFoundUploadError', () => {
  describe('NotFoundUploadError.constructor', function () {
    it('should construct', () => {
      expect(new NotFoundUploadError('context')).toBeDefined();
    });
  });
});
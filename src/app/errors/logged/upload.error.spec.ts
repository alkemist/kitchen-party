import { UploadError } from './upload.error';

describe('UploadError', () => {
  describe('UploadError.constructor', function () {
    it('should construct', () => {
      expect(new UploadError({} as File)).toBeDefined();
    });
  });
});
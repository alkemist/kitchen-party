import { UploadError } from '@app/errors';

describe('UploadError', () => {
  describe('UploadError.constructor', function () {
    it('should construct', () => {
      expect(new UploadError({} as File)).toBeDefined();
    });
  });
});
import { NotFoundUploadError } from '@app/errors';

describe('NotFoundUploadError', () => {
  describe('NotFoundUploadError.constructor', function () {
    it('should construct', () => {
      expect(new NotFoundUploadError('context')).toBeDefined();
    });
  });
});
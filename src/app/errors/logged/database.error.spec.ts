import { DatabaseError } from '@errors';

describe('DatabaseError', () => {
  describe('DatabaseError.constructor', function () {
    it('should construct', () => {
      expect(new DatabaseError('message', {id: 'id'})).toBeDefined();
    });
  });
});
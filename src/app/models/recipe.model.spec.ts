import { RecipeModel } from './recipe.model';

describe('RecipeModel', () => {
  describe('RecipeModel.constructor', function () {
    it('should construct', () => {
      expect(new RecipeModel({})).toBeDefined();
    });
  });
});
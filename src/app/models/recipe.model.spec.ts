import { RecipeModel } from './recipe.model';

describe('RecipeModel', () => {
  describe('RecipeModel.constructor', () => {
    it('should construct', () => {
      expect(new RecipeModel({})).toBeDefined();
    });
  });
});
import { RecipeIngredientModel } from './recipe-ingredient.model';

describe('RecipeIngredientModel', () => {
  describe('RecipeIngredientModel.constructor', function () {
    it('should construct', () => {
      expect(new RecipeIngredientModel({})).toBeDefined();
    });
  });
});
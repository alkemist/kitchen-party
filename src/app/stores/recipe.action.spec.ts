import { AddRecipe, FillRecipes, RemoveRecipe, UpdateRecipe } from './recipe.action';

describe('AddRecipe', () => {
  describe('AddRecipe.constructor', () => {
    it('should construct', () => {
      expect(new AddRecipe({})).toBeDefined();
    });
  });
});

describe('UpdateRecipe', () => {
  describe('UpdateRecipe.constructor', () => {
    it('should construct', () => {
      expect(new UpdateRecipe({})).toBeDefined();
    });
  });
});

describe('RemoveRecipe', () => {
  describe('RemoveRecipe.constructor', () => {
    it('should construct', () => {
      expect(new RemoveRecipe({})).toBeDefined();
    });
  });
});

describe('FillRecipes', () => {
  describe('FillRecipes.constructor', () => {
    it('should construct', () => {
      expect(new FillRecipes([])).toBeDefined();
    });
  });
});
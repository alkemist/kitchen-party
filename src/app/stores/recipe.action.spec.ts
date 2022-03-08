import { AddRecipe, FillRecipes, RemoveRecipe, UpdateRecipe } from './recipe.action';

describe('AddRecipe', () => {
  describe('AddRecipe.constructor', function () {
    it('should construct', () => {
      expect(new AddRecipe({})).toBeDefined();
    });
  });
});

describe('UpdateRecipe', () => {
  describe('UpdateRecipe.constructor', function () {
    it('should construct', () => {
      expect(new UpdateRecipe({})).toBeDefined();
    });
  });
});

describe('RemoveRecipe', () => {
  describe('RemoveRecipe.constructor', function () {
    it('should construct', () => {
      expect(new RemoveRecipe({})).toBeDefined();
    });
  });
});

describe('FillRecipes', () => {
  describe('FillRecipes.constructor', function () {
    it('should construct', () => {
      expect(new FillRecipes([])).toBeDefined();
    });
  });
});
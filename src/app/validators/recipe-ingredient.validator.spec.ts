import { recipeIngredientValidator } from './recipe-ingredient.validator';

describe('recipeIngredientValidator', () => {
  it('should valid', () => {
    expect(recipeIngredientValidator()).toBeDefined();
  });
});
import { ingredientLegumineMock } from '@mocks';
import { KitchenIngredientModel } from './kitchen-ingredient.model';

describe('KitchenIngredientModel', () => {
  describe('KitchenIngredientModel.constructor', () => {
    it('should construct', () => {
      expect(new KitchenIngredientModel({})).toBeDefined();
    });
  });

  describe('KitchenIngredientModel.name', () => {
    it('should construct', () => {
      const kitchenIngredient = new KitchenIngredientModel({
        ingredient: ingredientLegumineMock
      });
      expect(kitchenIngredient.name).toBe(ingredientLegumineMock.name);
    });
  });
});
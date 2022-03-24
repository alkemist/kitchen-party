import { KitchenIngredientModel } from './kitchen-ingredient.model';

describe('KitchenIngredientModel', () => {
  describe('KitchenIngredientModel.constructor', () => {
    it('should construct', () => {
      expect(new KitchenIngredientModel({})).toBeDefined();
    });
  });
});
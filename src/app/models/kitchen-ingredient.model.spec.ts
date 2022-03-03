import { KitchenIngredientModel } from './kitchen-ingredient.model';

describe('KitchenIngredientModel', () => {
  describe('KitchenIngredientModel.constructor', function () {
    it('should construct', () => {
      expect(new KitchenIngredientModel({})).toBeDefined();
    });
  });
});
import {
  AddKitchenIngredient,
  FillKitchenIngredients,
  RemoveKitchenIngredient,
  UpdateKitchenIngredient
} from './kitchen.action';

describe('AddKitchenIngredient', () => {
  describe('AddKitchenIngredient.constructor', () => {
    it('should construct', () => {
      expect(new AddKitchenIngredient({})).toBeDefined();
    });
  });
});

describe('UpdateKitchenIngredient', () => {
  describe('UpdateKitchenIngredient.constructor', () => {
    it('should construct', () => {
      expect(new UpdateKitchenIngredient({})).toBeDefined();
    });
  });
});

describe('RemoveKitchenIngredient', () => {
  describe('RemoveKitchenIngredient.constructor', () => {
    it('should construct', () => {
      expect(new RemoveKitchenIngredient({})).toBeDefined();
    });
  });
});

describe('FillKitchenIngredients', () => {
  describe('FillKitchenIngredients.constructor', () => {
    it('should construct', () => {
      expect(new FillKitchenIngredients([])).toBeDefined();
    });
  });
});
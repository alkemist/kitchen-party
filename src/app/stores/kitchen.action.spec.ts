import {
  AddKitchenIngredient,
  FillKitchenIngredients,
  RemoveKitchenIngredient,
  UpdateKitchenIngredient
} from './kitchen.action';

describe('AddKitchenIngredient', () => {
  describe('AddKitchenIngredient.constructor', function () {
    it('should construct', () => {
      expect(new AddKitchenIngredient({})).toBeDefined();
    });
  });
});

describe('UpdateKitchenIngredient', () => {
  describe('UpdateKitchenIngredient.constructor', function () {
    it('should construct', () => {
      expect(new UpdateKitchenIngredient({})).toBeDefined();
    });
  });
});

describe('RemoveKitchenIngredient', () => {
  describe('RemoveKitchenIngredient.constructor', function () {
    it('should construct', () => {
      expect(new RemoveKitchenIngredient({})).toBeDefined();
    });
  });
});

describe('FillKitchenIngredients', () => {
  describe('FillKitchenIngredients.constructor', function () {
    it('should construct', () => {
      expect(new FillKitchenIngredients([])).toBeDefined();
    });
  });
});
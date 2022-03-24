import { AddIngredient, FillIngredients, RemoveIngredient, UpdateIngredient } from './ingredient.action';

describe('AddIngredient', () => {
  describe('AddIngredient.constructor', () => {
    it('should construct', () => {
      expect(new AddIngredient({})).toBeDefined();
    });
  });
});

describe('UpdateIngredient', () => {
  describe('UpdateIngredient.constructor', () => {
    it('should construct', () => {
      expect(new UpdateIngredient({})).toBeDefined();
    });
  });
});

describe('RemoveIngredient', () => {
  describe('RemoveIngredient.constructor', () => {
    it('should construct', () => {
      expect(new RemoveIngredient({})).toBeDefined();
    });
  });
});

describe('FillIngredients', () => {
  describe('FillIngredients.constructor', () => {
    it('should construct', () => {
      expect(new FillIngredients([])).toBeDefined();
    });
  });
});
import {
  ingredientLegumineMock,
  ingredientMeatMock,
  recipeIngredientAnimalFatMock,
  recipeIngredientLegumineMock,
  recipeIngredientMeatMock,
  recipeIngredientRecipeMock,
  recipeIngredientVegetableFatMock,
  recipeIngredientVegetableMock,
  recipeIngredientVegetableOutOfSeasonMock
} from '@mocks';
import {MeasureUnitLabelEnum} from '@enums';
import {EnumHelper} from '@tools';
import {RelationIngredientModel} from "./relation-ingredient.model";

describe('RelationIngredientModel', () => {
  const recipeIngredientMeat2Mock = {
    ...recipeIngredientMeatMock,
    ingredient: {
      ...ingredientMeatMock,
      name: 'Ingredient A',
    }
  } as RelationIngredientModel;
  const measureUnits = EnumHelper.enumToObject(MeasureUnitLabelEnum);

  describe('RelationIngredientModel.constructor', () => {
    it('should construct', () => {
      expect(new RelationIngredientModel({})).toBeDefined();
    });
    it('should construct', () => {
      expect(new RelationIngredientModel({
        ingredientId: '',
        ingredient: ingredientLegumineMock,
        recipeId: '',
        recipe: recipeIngredientLegumineMock
      })).toBeDefined();
    });
  });

  describe('RelationIngredientModel.baseQuantity', () => {
    const recipeIngredientVegetableOutOfSeasonLiquidMock = new RelationIngredientModel(recipeIngredientVegetableOutOfSeasonMock);
    recipeIngredientVegetableOutOfSeasonLiquidMock.ingredient!.isLiquid = true;

    const recipeIngredientMeatLiquidMock = new RelationIngredientModel(recipeIngredientMeatMock);
    recipeIngredientMeatLiquidMock.ingredient!.isLiquid = true;

    it.each([
      {recipeIngredient: recipeIngredientVegetableMock, result: {count: 3, measure: 'barquette'}},
      {
        recipeIngredient: recipeIngredientVegetableOutOfSeasonMock,
        result: {count: 20, unit: MeasureUnitLabelEnum.gram}
      },
      {
        recipeIngredient: recipeIngredientVegetableOutOfSeasonLiquidMock,
        result: {count: 20, unit: MeasureUnitLabelEnum.milliliter}
      },
      {recipeIngredient: recipeIngredientMeatMock, result: {count: 30, unit: MeasureUnitLabelEnum.gram}},
      {recipeIngredient: recipeIngredientMeatLiquidMock, result: {count: 30, unit: MeasureUnitLabelEnum.milliliter}},
      {recipeIngredient: recipeIngredientLegumineMock, result: {count: 600, unit: MeasureUnitLabelEnum.gram}},
      {
        recipeIngredient: recipeIngredientVegetableFatMock,
        result: {count: 2000, unit: MeasureUnitLabelEnum.milliliter}
      },
      {recipeIngredient: recipeIngredientAnimalFatMock, result: {count: 0, measure: ''}},
      {recipeIngredient: recipeIngredientRecipeMock, result: {count: 3000, unit: MeasureUnitLabelEnum.gram}},
    ])('should return $result', ({recipeIngredient, result}) => {
      expect(recipeIngredient.baseQuantity).toEqual(result);
    });
  });

  describe('RelationIngredientModel.ingredientIds', () => {
    it('should return empty array', () => {
      expect(new RelationIngredientModel({}).ingredientIds).toEqual([]);
    });
  });

  describe('RelationIngredientModel.unitOrMeasureToString', () => {
    it.each([
      [ recipeIngredientAnimalFatMock, '' ],
      [ recipeIngredientMeatMock, '2 Tablespoon' ],
      [ recipeIngredientLegumineMock, '600 Gram' ],
      [ recipeIngredientVegetableMock, '3 barquette' ],
      [ recipeIngredientVegetableFatMock, '200 Centiliter' ],
      [ recipeIngredientRecipeMock, '3 Kilogram' ],
    ])('should be converted to string', (recipeIngredient, recipeIngredientStr) => {
      expect(
        RelationIngredientModel.unitOrMeasureToString(
          recipeIngredient as RelationIngredientModel,
          measureUnits
        )
      ).toBe(recipeIngredientStr);
    });
  });

  describe('RelationIngredientModel.recipeIngredientToString', () => {
    it.each([
      [ recipeIngredientAnimalFatMock, 'Ingredient Animal Fat 1' ],
      [ recipeIngredientMeatMock, 'Ingredient Meat 1:  2 Tablespoon' ],
      [ recipeIngredientLegumineMock, 'Ingredient Legumine 1:  600 Gram' ],
      [ recipeIngredientVegetableMock, 'Fraise:  3 barquette' ],
      [ recipeIngredientVegetableFatMock, 'Ingredient Vegetable Fat 1:  200 Centiliter' ],
      [ recipeIngredientRecipeMock, 'Recipe Ingredient 1:  3 Kilogram' ],
    ])('should be converted to string', (recipeIngredient, recipeIngredientStr) => {
      expect(
        RelationIngredientModel.relationIngredientToString(
          recipeIngredient as RelationIngredientModel,
          measureUnits
        )
      ).toBe(recipeIngredientStr);
    });
  });

  describe('RelationIngredientModel.orderRelationIngredients', () => {
    const recipeIngredients: RelationIngredientModel[] = [
      recipeIngredientMeatMock,
      recipeIngredientMeat2Mock,
      recipeIngredientLegumineMock,
      recipeIngredientVegetableMock,
      recipeIngredientVegetableFatMock,
      recipeIngredientRecipeMock
    ];
    const recipeIngredientIdsSortedExpected = [
      recipeIngredientMeat2Mock.id,
      recipeIngredientMeatMock.id,
      recipeIngredientVegetableMock.id,
      recipeIngredientLegumineMock.id,
      recipeIngredientVegetableFatMock.id,
      recipeIngredientRecipeMock.id,
    ];

    const recipeIngredientsSorted = RelationIngredientModel.orderRelationIngredients(recipeIngredients);
    const recipeIngredientIdsSorted = recipeIngredientsSorted.map(recipeIngredient => recipeIngredient.id);

    it('should sort recipeIngredients', () => {
      expect(recipeIngredientIdsSorted).toEqual(recipeIngredientIdsSortedExpected);
    });
  });

  describe('RelationIngredientModel.orderTwoRelationIngredients', () => {
    it.each([
      [ recipeIngredientMeatMock, recipeIngredientLegumineMock, -1 ],
      [ recipeIngredientMeatMock, recipeIngredientMeat2Mock, 1 ],
      [ recipeIngredientVegetableFatMock, recipeIngredientVegetableFatMock, 0 ],
      [ {}, {}, 0 ],
    ])('should sort', (recipeIngredientA, recipeIngredientB, result) => {
      expect(
        RelationIngredientModel.orderTwoRelationIngredients(recipeIngredientA, recipeIngredientB)
      ).toEqual(result);
    });
  });
});

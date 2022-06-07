import {
  recipeIngredientAnimalFatMock,
  recipeIngredientLegumineMock,
  recipeIngredientMeatMock,
  recipeIngredientRecipeMock,
  recipeIngredientVegetableFatMock,
  recipeIngredientVegetableMock,
  recipeIngredientVegetableOutOfSeasonMock
} from '@app/mocks/recipe-ingredient.mock';
import { DietTypeLabelEnum, MeasureUnitKeyEnum, MeasureUnitLabelEnum } from '@enums';
import { ingredientLegumineMock, ingredientMeatMock, recipeIngredientMock } from '@mocks';
import { EnumHelper } from '@tools';
import { RecipeIngredientModel } from './recipe-ingredient.model';

describe('RecipeIngredientModel', () => {
  const recipeIngredientMeat2Mock = {
    ...recipeIngredientMeatMock,
    ingredient: {
      ...ingredientMeatMock,
      name: 'Ingredient A',
    }
  } as RecipeIngredientModel;
  const measureUnits = EnumHelper.enumToObject(MeasureUnitLabelEnum);

  describe('RecipeIngredientModel.constructor', () => {
    it('should construct', () => {
      expect(new RecipeIngredientModel({})).toBeDefined();
    });
    it('should construct', () => {
      expect(new RecipeIngredientModel({
        ingredientId: '',
        ingredient: ingredientLegumineMock,
        recipeId: '',
        recipe: recipeIngredientLegumineMock
      })).toBeDefined();
    });
  });

  describe('RecipeIngredientModel.baseQuantity', () => {
    const recipeIngredientVegetableOutOfSeasonLiquidMock = new RecipeIngredientModel(recipeIngredientVegetableOutOfSeasonMock);
    recipeIngredientVegetableOutOfSeasonLiquidMock.ingredient!.isLiquid = true;

    const recipeIngredientMeatLiquidMock = new RecipeIngredientModel(recipeIngredientMeatMock);
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

  describe('RecipeIngredientModel.ingredientIds', () => {
    it('should return empty array', () => {
      expect(new RecipeIngredientModel({}).ingredientIds).toEqual([]);
    });
  });

  describe('RecipeIngredientModel.hasOption', () => {
    it.each([
      {recipeIngredient: recipeIngredientMeatMock, option: DietTypeLabelEnum.meat, result: true},
      {recipeIngredient: recipeIngredientAnimalFatMock, option: DietTypeLabelEnum.vege, result: true},
      {recipeIngredient: recipeIngredientVegetableFatMock, option: DietTypeLabelEnum.vegan, result: true},
      {recipeIngredient: recipeIngredientLegumineMock, option: DietTypeLabelEnum.vegan, result: false},
    ])('should return $result', ({recipeIngredient, option, result}) => {
      expect(recipeIngredient.hasOption(option)).toEqual(result);
    });
  });

  describe('RecipeIngredientModel.format', () => {
    it.each([ [ 'gram' ], [ 'Gram' ], [ MeasureUnitLabelEnum.gram ] ])
    ('should retrieve unit', (unit) => {
      expect(
        RecipeIngredientModel.format({
          unitOrMeasure: unit,
        }, measureUnits)
      ).toEqual(
        {
          unit: MeasureUnitKeyEnum.gram,
          measure: '',
        }
      );
    });

    it('should retrieve measure', () => {
      const measure = 'feuille';
      expect(
        RecipeIngredientModel.format({
          unitOrMeasure: measure,
        }, measureUnits)
      ).toEqual(
        {
          measure: measure,
          unit: null
        }
      );
    });

    it('should retrieve ingredient', () => {
      expect(
        RecipeIngredientModel.format({
          ingredientOrRecipe: ingredientLegumineMock,
        }, measureUnits)
      ).toEqual(
        {
          ingredient: ingredientLegumineMock
        }
      );
    });

    it('should retrieve recipe', () => {
      expect(
        RecipeIngredientModel.format({
          ingredientOrRecipe: recipeIngredientMock,
        }, measureUnits)
      ).toEqual(
        {
          recipe: recipeIngredientMock
        }
      );
    });
  });

  describe('RecipeIngredientModel.unitOrMeasureToString', () => {
    it.each([
      [ recipeIngredientAnimalFatMock, '' ],
      [ recipeIngredientMeatMock, '2 Tablespoon' ],
      [ recipeIngredientLegumineMock, '600 Gram' ],
      [ recipeIngredientVegetableMock, '3 barquette' ],
      [ recipeIngredientVegetableFatMock, '200 Centiliter' ],
      [ recipeIngredientRecipeMock, '3 Kilogram' ],
    ])('should be converted to string', (recipeIngredient, recipeIngredientStr) => {
      expect(
        RecipeIngredientModel.unitOrMeasureToString(
          recipeIngredient as RecipeIngredientModel,
          measureUnits
        )
      ).toBe(recipeIngredientStr);
    });
  });

  describe('RecipeIngredientModel.recipeIngredientToString', () => {
    it.each([
      [ recipeIngredientAnimalFatMock, 'Ingredient Animal Fat 1' ],
      [ recipeIngredientMeatMock, 'Ingredient Meat 1:  2 Tablespoon' ],
      [ recipeIngredientLegumineMock, 'Ingredient Legumine 1:  600 Gram' ],
      [ recipeIngredientVegetableMock, 'Fraise:  3 barquette' ],
      [ recipeIngredientVegetableFatMock, 'Ingredient Vegetable Fat 1:  200 Centiliter' ],
      [ recipeIngredientRecipeMock, 'Recipe Ingredient 1:  3 Kilogram' ],
    ])('should be converted to string', (recipeIngredient, recipeIngredientStr) => {
      expect(
        RecipeIngredientModel.recipeIngredientToString(
          recipeIngredient as RecipeIngredientModel,
          measureUnits
        )
      ).toBe(recipeIngredientStr);
    });
  });

  describe('RecipeIngredientModel.orderRecipeIngredients', () => {
    const recipeIngredients: RecipeIngredientModel[] = [
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

    const recipeIngredientsSorted = RecipeIngredientModel.orderRecipeIngredients(recipeIngredients);
    const recipeIngredientIdsSorted = recipeIngredientsSorted.map(recipeIngredient => recipeIngredient.id);

    it('should sort recipeIngredients', () => {
      expect(recipeIngredientIdsSorted).toEqual(recipeIngredientIdsSortedExpected);
    });
  });

  describe('RecipeIngredientModel.orderTwoRecipeIngredients', () => {
    it.each([
      [ recipeIngredientMeatMock, recipeIngredientLegumineMock, -1 ],
      [ recipeIngredientMeatMock, recipeIngredientMeat2Mock, 1 ],
      [ recipeIngredientVegetableFatMock, recipeIngredientVegetableFatMock, 0 ],
      [ {}, {}, 0 ],
    ])('should sort', (recipeIngredientA, recipeIngredientB, result) => {
      expect(
        RecipeIngredientModel.orderTwoRecipeIngredients(recipeIngredientA, recipeIngredientB)
      ).toEqual(result);
    });
  });
});
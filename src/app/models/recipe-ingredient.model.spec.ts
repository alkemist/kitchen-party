import {
  recipeIngredientAnimalFatMock,
  recipeIngredientLegumineMock,
  recipeIngredientMeatMock,
  recipeIngredientRecipeMock,
  recipeIngredientVegetableFatMock,
  recipeIngredientVegetableMock
} from '@app/mocks/recipe-ingredient.mock';
import { MeasureUnitKeyEnum, MeasureUnitLabelEnum } from '@enums';
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
      [ recipeIngredientMeatMock, '2' ],
      [ recipeIngredientLegumineMock, '600 Gram' ],
      [ recipeIngredientVegetableMock, '3 feuille' ],
      [ recipeIngredientVegetableFatMock, '200 Centiliter' ],
      [ recipeIngredientRecipeMock, '3' ],
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
      [ recipeIngredientMeatMock, 'Ingredient Meat 1:  2' ],
      [ recipeIngredientLegumineMock, 'Ingredient Legumine 1:  600 Gram' ],
      [ recipeIngredientVegetableMock, 'Ingredient Vegetable 1:  3 feuille' ],
      [ recipeIngredientVegetableFatMock, 'Ingredient Vegetable Fat 1:  200 Centiliter' ],
      [ recipeIngredientRecipeMock, 'Recipe Ingredient 1:  3' ],
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
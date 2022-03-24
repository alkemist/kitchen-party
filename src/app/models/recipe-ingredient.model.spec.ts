import {
  recipeIngredientLegumineMock,
  recipeIngredientMeatMock,
  recipeIngredientRecipeMock,
  recipeIngredientVegetableFatMock,
  recipeIngredientVegetableMock
} from '@app/mocks/recipe-ingredient.mock';
import { MeasureUnitLabelEnum } from '@enums';
import { ingredientMeatMock } from '@mocks';
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

  describe('RecipeIngredientModel.constructor', function () {
    it('should construct', () => {
      expect(new RecipeIngredientModel({})).toBeDefined();
    });
  });

  describe('RecipeIngredientModel.recipeIngredientToString', function () {
    it.each([
      [ recipeIngredientMeatMock, 'Ingredient Meat 1:  2' ],
      [ recipeIngredientLegumineMock, 'Ingredient Legumine 1:  600 Gram' ],
      [ recipeIngredientVegetableMock, 'Ingredient Vegetable 1:  3 feuille' ],
      [ recipeIngredientVegetableFatMock, 'Ingredient Vegetable Fat 1:  200 Centiliter' ],
      [ recipeIngredientRecipeMock, 'Recipe Ingredient 1:  3' ],
    ])('should be converted to string', (recipeIngredient, recipeIngredientStr) => {
      expect(
        RecipeIngredientModel.recipeIngredientToString(
          recipeIngredient as RecipeIngredientModel,
          EnumHelper.enumToObject(MeasureUnitLabelEnum)
        )
      ).toBe(recipeIngredientStr);
    });
  });

  describe('RecipeIngredientModel.orderRecipeIngredients', function () {
    const recipeIngredients: RecipeIngredientModel[] = [
      recipeIngredientMeatMock,
      recipeIngredientMeat2Mock,
      recipeIngredientLegumineMock,
      recipeIngredientVegetableMock,
      recipeIngredientVegetableFatMock,
      recipeIngredientRecipeMock
    ];
    const recipeIngredientIdsSortedExpected = [
      recipeIngredientRecipeMock.id,
      recipeIngredientMeat2Mock.id,
      recipeIngredientMeatMock.id,
      recipeIngredientVegetableMock.id,
      recipeIngredientLegumineMock.id,
      recipeIngredientVegetableFatMock.id,
    ];

    const recipeIngredientsSorted = RecipeIngredientModel.orderRecipeIngredients(recipeIngredients);
    const recipeIngredientIdsSorted = recipeIngredientsSorted.map(recipeIngredient => recipeIngredient.id);

    it('should sort recipeIngredients', () => {
      expect(recipeIngredientIdsSorted).toEqual(recipeIngredientIdsSortedExpected);
    });
  });

  describe('RecipeIngredientModel.orderTwoRecipeIngredients', function () {
    it('should sort recipeIngredients with different type', () => {
      expect(
        RecipeIngredientModel.orderTwoRecipeIngredients(recipeIngredientMeatMock, recipeIngredientLegumineMock)
      ).toEqual(-1);
    });

    it('should sort recipeIngredients with same type but different name', () => {
      expect(
        RecipeIngredientModel.orderTwoRecipeIngredients(recipeIngredientMeatMock, recipeIngredientMeat2Mock)
      ).toEqual(1);
    });

    it('should sort recipeIngredients with same type', () => {
      expect(
        RecipeIngredientModel.orderTwoRecipeIngredients(recipeIngredientVegetableFatMock, recipeIngredientVegetableFatMock)
      ).toEqual(0);
    });
  });
});
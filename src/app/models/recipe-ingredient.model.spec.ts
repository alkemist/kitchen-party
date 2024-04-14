import {
  ingredientLegumineMock,
  recipeIngredientAnimalFatMock,
  recipeIngredientLegumineMock,
  recipeIngredientMeatMock,
  recipeIngredientMock,
  recipeIngredientVegetableFatMock
} from '@mocks';
import { DietTypeLabelEnum, MeasureUnitKeyEnum, MeasureUnitLabelEnum } from '@enums';
import { EnumHelper } from '@tools';
import { RecipeIngredientModel } from "./recipe-ingredient.model";

describe('RecipeIngredientModel', () => {
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

  describe('RecipeIngredientModel.hasOption', () => {
    it.each([
      { recipeIngredient: recipeIngredientMeatMock, option: DietTypeLabelEnum.meat, result: true },
      { recipeIngredient: recipeIngredientAnimalFatMock, option: DietTypeLabelEnum.vege, result: true },
      { recipeIngredient: recipeIngredientVegetableFatMock, option: DietTypeLabelEnum.vegan, result: true },
      { recipeIngredient: recipeIngredientLegumineMock, option: DietTypeLabelEnum.vegan, result: false },
    ])('should return $result', ({ recipeIngredient, option, result }) => {
      expect(recipeIngredient.hasOption(option)).toEqual(result);
    });
  });

  describe('RecipeIngredientModel.format', () => {
    it.each([ [ 'gram' ], [ 'Gram' ], [ MeasureUnitLabelEnum.gram ] ])
    ('should retrieve unit', (unit) => {
      expect(
        RecipeIngredientModel.import({
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
        RecipeIngredientModel.import({
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
        RecipeIngredientModel.import({
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
        RecipeIngredientModel.import({
          ingredientOrRecipe: recipeIngredientMock,
        }, measureUnits)
      ).toEqual(
        {
          recipe: recipeIngredientMock
        }
      );
    });
  });
});

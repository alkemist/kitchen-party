import { DietTypeLabelEnum, RecipeTypeLabelEnum } from '@enums';
import {
  dateSeasonMock,
  ingredientAnimalFatMock,
  ingredientLegumineMock,
  ingredientMeatMock,
  ingredientVegetableFatMock,
  recipeFishMock,
  recipeIngredientMock,
  recipeLegumineMock,
  recipeMeatMock,
  recipeOptionsMock,
  recipeVeganMock,
  recipeVegeMock,
  recipeVegetableMock
} from '@mocks';
import { RecipeModel } from './recipe.model';

describe('RecipeModel', () => {
  describe('RecipeModel.constructor', () => {
    it('should construct', () => {
      expect(new RecipeModel({})).toBeDefined();
    });
  });

  describe('RecipeModel.orderedRecipeIngredients', () => {
    it('should order recipe ingredients', () => {
      const recipeIngredientsSorted = recipeIngredientMock.orderedRecipeIngredients;
      const ingredientIdsSorted = recipeIngredientsSorted.map(recipeIngredient => recipeIngredient.ingredient?.id);
      expect(ingredientIdsSorted).toEqual([
        ingredientAnimalFatMock.id,
        ingredientVegetableFatMock.id
      ]);
    });
  });

  describe('RecipeModel.typeName', () => {
    it('should return type name', () => {
      expect(recipeLegumineMock.typeName).toEqual(RecipeTypeLabelEnum.gratin);
    });
  });

  describe('RecipeModel.ingredientIds', () => {
    it.each([
      {recipe: recipeIngredientMock, ingredientIds: [ ingredientVegetableFatMock.id, ingredientAnimalFatMock.id, ]},
      {
        recipe: recipeMeatMock,
        ingredientIds: [ ingredientLegumineMock.id, ingredientMeatMock.id, ingredientVegetableFatMock.id, ingredientAnimalFatMock.id ]
      }
    ])
    ('$recipe.name should return ingredient ids', ({recipe, ingredientIds}) => {
      expect(recipe.ingredientIds).toEqual(ingredientIds);
    });
  });

  describe('RecipeModel.diet', () => {
    it.each([
      {recipe: recipeIngredientMock, expectedDiet: DietTypeLabelEnum.vege},
      {recipe: recipeLegumineMock, expectedDiet: DietTypeLabelEnum.vegan},
      {recipe: recipeVegetableMock, expectedDiet: DietTypeLabelEnum.vege},
      {recipe: recipeVegeMock, expectedDiet: DietTypeLabelEnum.vege},
      {recipe: recipeVeganMock, expectedDiet: DietTypeLabelEnum.vegan},
      {recipe: recipeMeatMock, expectedDiet: DietTypeLabelEnum.meat},
      {recipe: recipeFishMock, expectedDiet: DietTypeLabelEnum.fish},
    ])
    ('$recipe.name should return $expectedDiet', ({recipe, expectedDiet}) => {
      expect(recipe.diet).toEqual(expectedDiet);
    });
  });

  describe('RecipeModel.dietClassName', () => {
    it.each([
      {recipe: recipeIngredientMock, expectedDietClassname: 'warning'},
      {recipe: recipeLegumineMock, expectedDietClassname: 'success'},
      {recipe: recipeMeatMock, expectedDietClassname: 'danger'},
      {recipe: recipeFishMock, expectedDietClassname: 'primary'},
    ])
    ('$recipe.name should return $expectedDietClassname', ({recipe, expectedDietClassname}) => {
      expect(recipe.dietClassName).toEqual(expectedDietClassname);
    });
  });

  describe('RecipeModel.nameContain', () => {
    it.each([
      {recipe: recipeIngredientMock, search: ' Ingredient', result: true},
      {recipe: recipeLegumineMock, search: '-legumine', result: true},
      {recipe: recipeMeatMock, search: 'Meat', result: true},
      {recipe: recipeFishMock, search: 'test', result: false},
    ])('$recipe.name should return $result', ({recipe, search, result}) => {
      expect(recipe.nameContain(search)).toEqual(result);
    });
  });

  describe('RecipeModel.dietIs', () => {
    it.each([
      {recipe: recipeIngredientMock, result: true},
      {recipe: recipeLegumineMock, result: true},
      {recipe: recipeMeatMock, result: false},
      {recipe: recipeFishMock, result: false},
    ])('$recipe.name should return $result', ({recipe, result}) => {
      expect(recipe.dietIs(DietTypeLabelEnum.vege)).toEqual(result);
    });
  });

  describe('RecipeModel.isSeason', () => {
    beforeEach(() => {
      jest
        .useFakeTimers()
        .setSystemTime(dateSeasonMock);
    });

    it.each([
      {recipe: recipeVeganMock, result: true},
      {recipe: recipeVegetableMock, result: true},
      {recipe: recipeFishMock, result: false},
    ])
    ('$recipe.name should return $result', ({recipe, result}) => {
      expect(recipe.isSeason()).toEqual(result);
    });
  });

  describe('RecipeModel.isVegan', () => {
    it.each([
      {recipe: recipeVeganMock, result: true},
      {recipe: recipeVegetableMock, result: false},
      {recipe: recipeMeatMock, result: false},
      {recipe: recipeFishMock, result: false},
    ])
    ('$recipe.name should return $result', ({recipe, result}) => {
      expect(recipe.isVegan()).toEqual(result);
    });
  });

  describe('RecipeModel.isVege', () => {
    it.each([
      {recipe: recipeVeganMock, result: true},
      {recipe: recipeVegetableMock, result: true},
      {recipe: recipeMeatMock, result: false},
      {recipe: recipeFishMock, result: false},
    ])
    ('$recipe.name should return $result', ({recipe, result}) => {
      expect(recipe.isVege()).toEqual(result);
    });
  });

  describe('RecipeModel.isMeat', () => {
    it.each([
      {recipe: recipeVeganMock, result: false},
      {recipe: recipeVegetableMock, result: false},
      {recipe: recipeMeatMock, result: true},
      {recipe: recipeFishMock, result: false},
    ])
    ('$recipe.name should return $result', ({recipe, result}) => {
      expect(recipe.isMeat()).toEqual(result);
    });
  });

  describe('RecipeModel.isFish', () => {
    it.each([
      {recipe: recipeVeganMock, result: false},
      {recipe: recipeVegetableMock, result: false},
      {recipe: recipeMeatMock, result: false},
      {recipe: recipeFishMock, result: true},
    ])
    ('$recipe.name should return $result', ({recipe, result}) => {
      expect(recipe.isFish()).toEqual(result);
    });
  });

  describe('RecipeModel.recipeIngredientsOption', () => {
    it.each([
      {
        recipe: recipeOptionsMock,
        option: DietTypeLabelEnum.meat,
        ingredientIds: [ ingredientLegumineMock.id, ingredientMeatMock.id ]
      },
      {
        recipe: recipeOptionsMock,
        option: DietTypeLabelEnum.vege,
        ingredientIds: [ ingredientLegumineMock.id, recipeIngredientMock.id ]
      },
      {
        recipe: recipeOptionsMock,
        option: DietTypeLabelEnum.vegan,
        ingredientIds: [ ingredientLegumineMock.id, ingredientVegetableFatMock.id ]
      }
    ])
    ('$recipe.name with option $option should return $ingredientIds', ({recipe, option, ingredientIds}) => {
      const recipeIngredients = recipe.recipeIngredientsOption(option);
      const recipeIngredientIds = recipeIngredients.map(recipeIngredient => recipeIngredient.ingredient ? recipeIngredient.ingredient.id : recipeIngredient.recipe?.id);

      expect(recipeIngredientIds).toEqual(ingredientIds);
    });
  });

  describe('RecipeModel.getOptions', () => {
    const options = recipeOptionsMock.getOptions();

    it('should return options', () => {
      const expectedIds = [
        [ ingredientLegumineMock.id, ingredientMeatMock.id ],
        [ ingredientLegumineMock.id, recipeIngredientMock.id ],
        [ ingredientLegumineMock.id, ingredientVegetableFatMock.id ]
      ];

      options.forEach((value, index) => {
        const recipeIngredientIds = value.recipeIngredients.map(recipeIngredient => recipeIngredient.ingredient ? recipeIngredient.ingredient.id : recipeIngredient.recipe?.id);
        expect(recipeIngredientIds).toEqual(expectedIds[index]);
      });

      expect.assertions(3);
    });
  });
});
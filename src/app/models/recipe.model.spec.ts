import { DietTypeLabelEnum, RecipeTypeKeyEnum, RecipeTypeLabelEnum } from '@enums';
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
  const recipeWithOnlyRecipe = new RecipeModel({
    recipeIngredients: [
      {
        recipe: recipeMeatMock,
        quantity: 1,
      },
      {
        recipe: recipeFishMock,
        quantity: 1,
      },
    ]
  });

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
      { recipe: recipeIngredientMock, ingredientIds: [ ingredientVegetableFatMock.id, ingredientAnimalFatMock.id, ] },
      {
        recipe: recipeMeatMock,
        ingredientIds: [ ingredientLegumineMock.id, ingredientMeatMock.id, ingredientVegetableFatMock.id, ingredientAnimalFatMock.id ]
      }
    ])
    ('$recipe.name should return ingredient ids', ({ recipe, ingredientIds }) => {
      expect(recipe.ingredientIds).toEqual(ingredientIds);
    });
  });

  describe('RecipeModel.diet', () => {
    it.each([
      { recipe: recipeIngredientMock, expectedDiet: DietTypeLabelEnum.vege },
      { recipe: recipeLegumineMock, expectedDiet: DietTypeLabelEnum.vegan },
      { recipe: recipeVegetableMock, expectedDiet: DietTypeLabelEnum.vege },
      { recipe: recipeVegeMock, expectedDiet: DietTypeLabelEnum.vege },
      { recipe: recipeVeganMock, expectedDiet: DietTypeLabelEnum.vegan },
      { recipe: recipeMeatMock, expectedDiet: DietTypeLabelEnum.meat },
      { recipe: recipeFishMock, expectedDiet: DietTypeLabelEnum.fish },
      { recipe: new RecipeModel({}), expectedDiet: '' },
    ])
    ('$recipe.name should return $expectedDiet', ({ recipe, expectedDiet }) => {
      expect(recipe.diet).toEqual(expectedDiet);
    });
  });

  describe('RecipeModel.dietClassName', () => {
    it.each([
      { recipe: recipeIngredientMock, expectedDietClassname: 'warning' },
      { recipe: recipeLegumineMock, expectedDietClassname: 'success' },
      { recipe: recipeMeatMock, expectedDietClassname: 'danger' },
      { recipe: recipeFishMock, expectedDietClassname: 'primary' },
      { recipe: new RecipeModel({}), expectedDietClassname: '' },
    ])
    ('$recipe.name should return $expectedDietClassname', ({ recipe, expectedDietClassname }) => {
      expect(recipe.dietClassName).toEqual(expectedDietClassname);
    });
  });

  describe('RecipeModel.nameContain', () => {
    it.each([
      { recipe: recipeIngredientMock, search: ' Ingredient', result: true },
      { recipe: recipeLegumineMock, search: '-legumine', result: true },
      { recipe: recipeMeatMock, search: 'Meat', result: true },
      { recipe: recipeFishMock, search: 'test', result: false },
    ])('$recipe.name should return $result', ({ recipe, search, result }) => {
      expect(recipe.nameContain(search)).toEqual(result);
    });
  });

  describe('RecipeModel.dietIs', () => {
    it.each([
      { recipe: recipeIngredientMock, diet: DietTypeLabelEnum.vege, result: true },
      { recipe: recipeLegumineMock, diet: DietTypeLabelEnum.vege, result: true },
      { recipe: recipeMeatMock, diet: DietTypeLabelEnum.meat, result: true },
      { recipe: recipeFishMock, diet: DietTypeLabelEnum.meat, result: false },
    ])('$recipe.name should return $result', ({ recipe, diet, result }) => {
      expect(recipe.dietIs(diet)).toEqual(result);
    });
  });

  describe('RecipeModel.isSeason', () => {
    beforeEach(() => {
      jest
        .useFakeTimers()
        .setSystemTime(dateSeasonMock);
    });

    it.each([
      { recipe: recipeVeganMock, result: true },
      { recipe: recipeVegetableMock, result: true },
      { recipe: recipeFishMock, result: false },
    ])
    ('$recipe.name should return $result', ({ recipe, result }) => {
      expect(recipe.isSeason()).toEqual(result);
    });
  });

  describe('RecipeModel.isVegan', () => {
    it.each([
      { recipe: recipeVeganMock, result: true },
      { recipe: recipeVegetableMock, result: false },
      { recipe: recipeMeatMock, result: false },
      { recipe: recipeFishMock, result: false },
      { recipe: recipeWithOnlyRecipe, result: false },
    ])
    ('$recipe.name should return $result', ({ recipe, result }) => {
      expect(recipe.isVegan()).toEqual(result);
    });
  });

  describe('RecipeModel.isVege', () => {
    it.each([
      { recipe: recipeVeganMock, result: true },
      { recipe: recipeVegetableMock, result: true },
      { recipe: recipeMeatMock, result: false },
      { recipe: recipeFishMock, result: false },
      { recipe: recipeWithOnlyRecipe, result: false },
    ])
    ('$recipe.name should return $result', ({ recipe, result }) => {
      expect(recipe.isVege()).toEqual(result);
    });
  });

  describe('RecipeModel.isMeat', () => {
    it.each([
      { recipe: recipeVeganMock, result: false },
      { recipe: recipeVegetableMock, result: false },
      { recipe: recipeMeatMock, result: true },
      { recipe: recipeFishMock, result: false },
      { recipe: recipeWithOnlyRecipe, result: true },
    ])
    ('$recipe.name should return $result', ({ recipe, result }) => {
      expect(recipe.isMeat()).toEqual(result);
    });
  });

  describe('RecipeModel.isFish', () => {
    it.each([
      { recipe: recipeVeganMock, result: false },
      { recipe: recipeVegetableMock, result: false },
      { recipe: recipeMeatMock, result: false },
      { recipe: recipeFishMock, result: true },
      { recipe: recipeWithOnlyRecipe, result: true },
    ])
    ('$recipe.name should return $result', ({ recipe, result }) => {
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
    ('$recipe.name with option $option should return $ingredientIds', ({ recipe, option, ingredientIds }) => {
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

  describe('RecipeModel.isSweet', () => {
    const nullRecipe = new RecipeModel({});
    const patePizzaRecipe = new RecipeModel({ type: RecipeTypeKeyEnum.ingredient, name: 'pâte à pizza' });
    const pateSableeRecipe = new RecipeModel({ type: RecipeTypeKeyEnum.ingredient, name: 'pâte sablée' });
    const saltyRecipe = new RecipeModel({ recipeIngredients: [ { recipe: recipeMeatMock } ] });
    const sweetRecipe = new RecipeModel({ recipeIngredients: [ { recipe: recipeVeganMock } ] });

    it.each([
      { recipe: nullRecipe, result: null },
      { recipe: patePizzaRecipe, result: null },
      { recipe: pateSableeRecipe, result: true },
      { recipe: recipeMeatMock, result: false },
      { recipe: recipeVeganMock, result: true },
      { recipe: saltyRecipe, result: false },
      { recipe: sweetRecipe, result: true },
    ])('$recipe.name should be $result', ({ recipe, result }) => {
      expect(recipe.isSweet()).toBe(result);
    });
  });

  describe('RecipeModel.isSalty', () => {
    const nullRecipe = new RecipeModel({});
    const patePizzaRecipe = new RecipeModel({ type: RecipeTypeKeyEnum.ingredient, name: 'pâte à pizza' });
    const pateSableeRecipe = new RecipeModel({ type: RecipeTypeKeyEnum.ingredient, name: 'pâte sablée' });
    const saltyRecipe = new RecipeModel({ recipeIngredients: [ { recipe: recipeMeatMock } ] });
    const sweetRecipe = new RecipeModel({ recipeIngredients: [ { recipe: recipeVeganMock } ] });

    it.each([
      { recipe: nullRecipe, result: null },
      { recipe: pateSableeRecipe, result: null },
      { recipe: patePizzaRecipe, result: true },
      { recipe: recipeVeganMock, result: false },
      { recipe: recipeMeatMock, result: true },
      { recipe: sweetRecipe, result: false },
      { recipe: saltyRecipe, result: true },
    ])('$recipe.name should be $result', ({ recipe, result }) => {
      expect(recipe.isSalty()).toBe(result);
    });
  });
});

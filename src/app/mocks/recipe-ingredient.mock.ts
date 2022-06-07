import { recipeIngredientMock } from '@app/mocks/recipe.mock';
import { MeasureUnitKeyEnum } from '@enums';
import { RecipeIngredientModel } from '@models';
import {
  ingredientAnimalFatMock,
  ingredientFishMock,
  ingredientLegumineMock,
  ingredientMeatMock,
  ingredientVegetableFatMock,
  ingredientVegetableMock,
  ingredientVegetableOutOfSeasonMock
} from './ingredient.mock';

export const recipeIngredientVegetableMock = new RecipeIngredientModel({
  id: 'recipeIngredientVegetableId1',
  ingredient: ingredientVegetableMock,
  quantity: 3,
  measure: 'barquette',
});

export const recipeIngredientVegetableOutOfSeasonMock = new RecipeIngredientModel({
  id: 'ingredientVegetableId1',
  ingredient: ingredientVegetableOutOfSeasonMock,
  quantity: 4,
  unit: MeasureUnitKeyEnum.teaspoon
});

export const recipeIngredientLegumineMock = new RecipeIngredientModel({
  id: 'recipeIngredientLegumineId1',
  ingredient: ingredientLegumineMock,
  quantity: 600,
  unit: MeasureUnitKeyEnum.gram,
});

export const recipeIngredientMeatMock = new RecipeIngredientModel({
  id: 'recipeIngredientMeatId1',
  ingredient: ingredientMeatMock,
  quantity: 2,
  unit: MeasureUnitKeyEnum.tablespoon,
  optionCarne: true,
});

export const recipeIngredientFishMock = new RecipeIngredientModel({
  id: 'recipeIngredientFishId1',
  ingredient: ingredientFishMock,
  quantity: 2,
});

export const recipeIngredientVegetableFatMock = new RecipeIngredientModel({
  id: 'recipeIngredientVegetableFatId1',
  ingredient: ingredientVegetableFatMock,
  quantity: 200,
  unit: MeasureUnitKeyEnum.centiliter,
  optionVegan: true,
});

export const recipeIngredientAnimalFatMock = new RecipeIngredientModel({
  id: 'ingredientAnimalFatId1',
  ingredient: ingredientAnimalFatMock,
  optionVege: true,
});

export const recipeIngredientRecipeMock = new RecipeIngredientModel({
  id: 'recipeIngredientRecipeId1',
  recipe: recipeIngredientMock,
  quantity: 3,
  unit: MeasureUnitKeyEnum.kilogram
});

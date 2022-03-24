import { recipeIngredientMock } from '@app/mocks/recipe.mock';
import { MeasureUnitKeyEnum } from '@enums';
import { RecipeIngredientModel } from '@models';
import {
  ingredientAnimalFatMock,
  ingredientLegumineMock,
  ingredientMeatMock,
  ingredientVegetableFatMock,
  ingredientVegetableMock
} from './ingredient.mock';

export const recipeIngredientLegumineMock = new RecipeIngredientModel({
  id: 'recipeIngredientLegumineId1',
  ingredient: ingredientLegumineMock,
  quantity: 600,
  unit: MeasureUnitKeyEnum.gram
});

export const recipeIngredientVegetableMock = new RecipeIngredientModel({
  id: 'recipeIngredientVegetableId1',
  ingredient: ingredientVegetableMock,
  quantity: 3,
  measure: 'feuille'
});

export const recipeIngredientMeatMock = new RecipeIngredientModel({
  id: 'recipeIngredientMeatId1',
  ingredient: ingredientMeatMock,
  quantity: 2,
});

export const recipeIngredientVegetableFatMock = new RecipeIngredientModel({
  id: 'recipeIngredientVegetableFatId1',
  ingredient: ingredientVegetableFatMock,
  quantity: 200,
  unit: MeasureUnitKeyEnum.centiliter
});

export const recipeIngredientAnimalFatMock = new RecipeIngredientModel({
  id: 'ingredientAnimalFatId1',
  ingredient: ingredientAnimalFatMock,
});

export const recipeIngredientRecipeMock = new RecipeIngredientModel({
  id: 'recipeIngredientRecipeId1',
  recipe: recipeIngredientMock,
  quantity: 3
});

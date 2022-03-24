import { MeasureUnitKeyEnum } from '@enums';
import { RecipeIngredientModel } from '@models';
import {
  ingredientLegumineMock,
  ingredientMeatMock,
  ingredientVegetableFatMock,
  ingredientVegetableMock
} from './ingredient.mock';
import { recipeIngredientMock } from './recipe.mock';

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

export const recipeIngredientRecipeMock = new RecipeIngredientModel({
  id: 'recipeIngredientRecipeId1',
  recipe: recipeIngredientMock,
  quantity: 3
});

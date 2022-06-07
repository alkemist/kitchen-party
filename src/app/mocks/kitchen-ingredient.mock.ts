import { MeasureUnitKeyEnum } from '@enums';
import { KitchenIngredientModel } from '@models';
import {
  ingredientLegumineMock,
  ingredientMeatMock,
  ingredientVegetableFatMock,
  ingredientVegetableMock
} from './ingredient.mock';
import { recipeIngredientMock } from './recipe.mock';

export const kitchenIngredientLegumineMock = new KitchenIngredientModel({
  id: 'kitchenIngredientLegumineId1',
  ingredient: ingredientLegumineMock,
  slug: ingredientLegumineMock.slug,
  quantity: 600,
  unit: MeasureUnitKeyEnum.gram
});

export const kitchenIngredientVegetableMock = new KitchenIngredientModel({
  id: 'kitchenIngredientVegetableId1',
  ingredient: ingredientVegetableMock,
  slug: ingredientVegetableMock.slug,
  quantity: 3,
  measure: 'feuille'
});

export const kitchenIngredientMeatMock = new KitchenIngredientModel({
  id: 'kitchenIngredientMeatId1',
  ingredient: ingredientMeatMock,
  slug: ingredientMeatMock.slug,
  quantity: 2,
});

export const kitchenIngredientVegetableFatMock = new KitchenIngredientModel({
  id: 'kitchenIngredientVegetableFatId1',
  ingredient: ingredientVegetableFatMock,
  slug: ingredientVegetableFatMock.slug,
  quantity: 200,
  unit: MeasureUnitKeyEnum.centiliter
});

export const kitchenIngredientRecipeMock = new KitchenIngredientModel({
  id: 'kitchenIngredientRecipeId1',
  recipe: recipeIngredientMock,
  slug: recipeIngredientMock.slug,
  quantity: 3
});

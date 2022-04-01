import { MeasureUnitKeyEnum, RecipeTypeKeyEnum } from '@enums';
import { RecipeModel } from '@models';
import {
  ingredientAnimalFatMock,
  ingredientFishMock,
  ingredientLegumineMock,
  ingredientMeatMock,
  ingredientVegetableFatMock,
  ingredientVegetableMock,
  ingredientVegetableOutOfSeasonMock
} from './ingredient.mock';

export const recipeIngredientMock = new RecipeModel({
  id: 'recipeIngredient1',
  name: 'Recipe Ingredient 1',
  slug: 'recipe-ingredient-1',
  type: RecipeTypeKeyEnum.ingredient,
  recipeIngredients: [
    {
      ingredient: ingredientVegetableFatMock,
      optionVegan: true,
      quantity: 2,
    },
    {
      ingredient: ingredientAnimalFatMock,
      optionVege: true,
      quantity: 1,
    },
  ]
});

export const recipeLegumineMock = new RecipeModel({
  id: 'recipeLegumineId1',
  name: 'Recipe Legumine 1',
  slug: 'recipe-legumine-1',
  type: RecipeTypeKeyEnum.gratin,
  recipeIngredients: [
    {
      ingredient: ingredientLegumineMock,
      quantity: 3,
    },
    {
      ingredient: ingredientLegumineMock,
      quantity: 7,
    },
    {
      ingredient: ingredientLegumineMock,
      quantity: 1,
      unit: MeasureUnitKeyEnum.kilogram
    },
  ]
});

export const recipeVegetableMock = new RecipeModel({
  id: 'recipeVegetableId1',
  name: 'Recipe Vegetable 1',
  slug: 'recipe-vegetable-1',
  type: RecipeTypeKeyEnum.gratin,
  recipeIngredients: [
    {
      ingredient: ingredientLegumineMock,
      quantity: 3,
      unit: MeasureUnitKeyEnum.centiliter
    },
    {
      ingredient: ingredientAnimalFatMock,
      quantity: 300,
      unit: MeasureUnitKeyEnum.gram
    },
  ]
});

export const recipeVegeMock = new RecipeModel({
  id: 'recipeVegeId1',
  name: 'Recipe Vege 1',
  slug: 'recipe-vege-1',
  recipeIngredients: [
    {
      ingredient: ingredientLegumineMock,
      quantity: 1,
      measure: 'barquette',
    },
    {
      ingredient: ingredientAnimalFatMock,
      quantity: 3,
    },
    {
      recipe: recipeLegumineMock,
      quantity: 1,
    },
  ]
});

export const recipeVeganMock = new RecipeModel({
  id: 'recipeVeganId1',
  name: 'Recipe Vegan 1',
  slug: 'recipe-vegan-1',
  recipeIngredients: [
    {
      ingredient: ingredientVegetableMock,
      quantity: 1,
      unit: MeasureUnitKeyEnum.liter
    },
    {
      ingredient: ingredientLegumineMock,
      quantity: 1,
      measure: 'feuille',
    },
    {
      ingredient: ingredientVegetableFatMock,
      quantity: 3,
    },
  ]
});

export const recipeMeatMock = new RecipeModel({
  id: 'recipeMeatId1',
  name: 'Recipe Meat 1',
  slug: 'recipe-meat-1',
  recipeIngredients: [
    {
      ingredient: ingredientLegumineMock,
      quantity: 1,
      unit: MeasureUnitKeyEnum.liter
    },
    {
      ingredient: ingredientMeatMock,
      quantity: 2,
      optionCarne: true
    },
    {
      recipe: recipeIngredientMock,
      quantity: 3,
    },
  ]
});

export const recipeFishMock = new RecipeModel({
  id: 'recipeFishId1',
  name: 'Recipe Fish 1',
  slug: 'recipe-fish-1',
  recipeIngredients: [
    {
      ingredient: ingredientVegetableOutOfSeasonMock,
      quantity: 2,
    },
    {
      ingredient: ingredientFishMock,
      quantity: 5,
    },
  ]
});

export const recipeOptionsMock = new RecipeModel({
  id: 'recipeOptions1',
  name: 'Recipe Options 1',
  slug: 'recipe-options-1',
  type: RecipeTypeKeyEnum.ingredient,
  recipeIngredients: [
    {
      ingredient: ingredientLegumineMock,
      quantity: 1,
      unit: MeasureUnitKeyEnum.liter
    },
    {
      ingredient: ingredientMeatMock,
      quantity: 2,
      optionCarne: true
    },
    {
      recipe: recipeIngredientMock,
      quantity: 3,
      optionVege: true,
    },
    {
      ingredient: ingredientVegetableFatMock,
      optionVegan: true,
      quantity: 2,
    },
  ]
});
import { MeasureUnitKeyEnum, RecipeTypeKeyEnum } from '@enums';
import { RecipeModel } from '@models';
import {
  ingredientAnimalFatMock,
  ingredientLegumineMock,
  ingredientMeatMock,
  ingredientVegetableFatMock
} from './ingredient.mock';

export const recipeMixedMock = new RecipeModel({
  id: 'recipeIngredient1',
  name: 'Recipe Ingredient 1',
  slug: 'recipe-ingredient-1',
  type: RecipeTypeKeyEnum.ingredient,
  recipeIngredients: [
    {
      ingredient: ingredientAnimalFatMock,
      quantity: 1,
    },
    {
      ingredient: ingredientVegetableFatMock,
      quantity: 2,
    }
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

export const recipeVeganMock = new RecipeModel({
  id: 'recipeVeganId1',
  name: 'Recipe Vegan 1',
  slug: 'recipe-vegan-1',
  recipeIngredients: [
    {
      ingredient: ingredientLegumineMock,
      quantity: 1,
      measure: 'feuille',
    },
    {
      ingredient: ingredientVegetableFatMock,
      quantity: 3,
    },
    {
      recipe: recipeLegumineMock,
      quantity: 1,
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
      recipe: recipeMixedMock,
      quantity: 3,
    },
  ]
});

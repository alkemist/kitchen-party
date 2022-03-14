import { MeasureUnitKeyEnum, RecipeTypeKeyEnum } from '@enums';
import { RecipeModel } from '@models';
import {
  ingredientAnimalFatMock,
  ingredientLegumineMock,
  ingredientMeatMock,
  ingredientVegetableFatMock
} from './ingredient.mock';

export const recipeIngredientMock = new RecipeModel({
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

export const recipeVegeMock = new RecipeModel({
  id: 'recipeVegeId1',
  name: 'Recipe Vege 1',
  slug: 'recipe-vege-1',
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

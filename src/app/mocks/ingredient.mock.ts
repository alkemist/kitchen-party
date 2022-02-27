import { IngredientModel } from '../models';
import { IngredientTypeKeyEnum } from '../enums';

export const ingredientVegetableMock = new IngredientModel({
  id: 'ingredientVegetableId1',
  name: 'Ingredient Vegetable 1',
  slug: 'ingredient-vegetable-1',
  type: IngredientTypeKeyEnum.fruits_vegetables_mushrooms,
  isLiquid: false,
  monthBegin: 1,
  monthEnd: 3
});

export const ingredientLegumineMock = new IngredientModel({
  id: 'ingredientLegumineId1',
  name: 'Ingredient Legumine 1',
  slug: 'ingredient-legumine-1',
  type: IngredientTypeKeyEnum.cereals_legumines,
  isLiquid: false,
});

export const ingredientMeatMock = new IngredientModel({
  id: 'ingredientMeatId2',
  name: 'Ingredient Meat 1',
  slug: 'ingredient-name-1',
  isLiquid: false,
  type: IngredientTypeKeyEnum.meats
});

export const ingredientAnimalFatMock = new IngredientModel({
  id: 'ingredientAnimalFatId3',
  name: 'Ingredient Animal Fat 1',
  slug: 'ingredient-animal-fat-1',
  isLiquid: true,
  type: IngredientTypeKeyEnum.animal_fats
});

export const ingredientVegetableFatMock = new IngredientModel({
  id: 'ingredientVegetableFatId4',
  name: 'Ingredient Vegetable Fat 1',
  slug: 'ingredient-vegetable-fat-1',
  isLiquid: true,
  type: IngredientTypeKeyEnum.vegetable_fats
});

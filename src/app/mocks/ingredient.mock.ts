import { IngredientModel } from '../models';
import { IngredientTypeKeyEnum } from '../enums';

export const ingredientLegumineMock = new IngredientModel({
  id: 'ingredientLegumineId1',
  name: 'Ingredient Legumine 1',
  slug: 'ingredient-legumine-1',
  type: IngredientTypeKeyEnum.cereals_legumines
});

export const ingredientMeatMock = new IngredientModel({
  id: 'ingredientMeatId2',
  name: 'Ingredient Meat 1',
  slug: 'ingredient-name-1',
  type: IngredientTypeKeyEnum.meats
});

export const ingredientAnimalFatMock = new IngredientModel({
  id: 'ingredientAnimalFatId3',
  name: 'Ingredient Animal Fat 1',
  slug: 'ingredient-animal-fat-1',
  type: IngredientTypeKeyEnum.animal_fats
});

export const ingredientVegetableFatMock = new IngredientModel({
  id: 'ingredientVegetableFatId4',
  name: 'Ingredient Vegetable Fat 1',
  slug: 'ingredient-vegetable-fat-1',
  type: IngredientTypeKeyEnum.vegetable_fats
});

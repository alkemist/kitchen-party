import { MeasureUnitKeyEnum } from '@enums';
import { KitchenIngredientModel } from '@models';
import { ingredientLegumineMock } from './ingredient.mock';
import { recipeIngredientMock } from './recipe.mock';

export const kitchenIngredientMock = new KitchenIngredientModel({
  ingredient: ingredientLegumineMock,
  slug: ingredientLegumineMock.slug,
  quantity: 600,
  unit: MeasureUnitKeyEnum.gram
});

export const kitchenIngredientRecipeMock = new KitchenIngredientModel({
  recipe: recipeIngredientMock,
  slug: recipeIngredientMock.slug,
  quantity: 3
});

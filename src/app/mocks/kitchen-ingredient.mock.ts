import { MeasureUnitKeyEnum } from '@enums';
import { KitchenIngredientModel } from '@models';
import { ingredientLegumineMock } from './ingredient.mock';
import { recipeMixedMock } from './recipe.mock';

export const kitchenIngredientMock = new KitchenIngredientModel({
  ingredient: ingredientLegumineMock,
  slug: ingredientLegumineMock.slug,
  quantity: 600,
  unit: MeasureUnitKeyEnum.gram
});

export const kitchenIngredientRecipeMock = new KitchenIngredientModel({
  recipe: recipeMixedMock,
  slug: recipeMixedMock.slug,
  quantity: 3
});

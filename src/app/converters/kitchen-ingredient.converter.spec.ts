import { kitchenIngredientConverter } from './kitchen-ingredient.converter';
import { kitchenIngredientMock, kitchenIngredientRecipeMock } from '../mocks/kitchen-ingredient.mock';
import { QueryDocumentSnapshot } from '@firebase/firestore';
import { KitchenIngredientInterface, RecipeInterface } from '../interfaces';
import { ingredientLegumineMock } from '../mocks/ingredient.mock';
import { recipeIngredientMock } from '../mocks/recipe.mock';
import { MeasureUnitKeyEnum } from '../enums';

describe('kitchenIngredientConverter', () => {
  const kitchenIngredientInFirestore: KitchenIngredientInterface = {
    ingredientId: ingredientLegumineMock.id,
    slug: ingredientLegumineMock.slug,
    recipeId: '',
    quantity: 600,
    unit: MeasureUnitKeyEnum.gram,
    measure: '',
    optionCarne: false,
    optionVege: false,
    optionVegan: false
  };
  const kitchenIngredientRecipeInFirestore: KitchenIngredientInterface = {
    recipeId: recipeIngredientMock.id,
    slug: recipeIngredientMock.slug,
    ingredientId: '',
    quantity: 3,
    measure: '',
    unit: null,
    optionCarne: false,
    optionVege: false,
    optionVegan: false
  };

  it('toFirestore with ingredient', () => {
    expect(kitchenIngredientConverter.toFirestore(kitchenIngredientMock)).toEqual(kitchenIngredientInFirestore)
  })

  it('toFirestore with recipe', () => {
    expect(kitchenIngredientConverter.toFirestore(kitchenIngredientRecipeMock)).toEqual(kitchenIngredientRecipeInFirestore)
  })

  it('fromFirestore', () => {
    expect(kitchenIngredientConverter.fromFirestore(
      {
        data: () => {
          return kitchenIngredientInFirestore
        }
      } as unknown as QueryDocumentSnapshot<RecipeInterface>
    )).toEqual(kitchenIngredientInFirestore);
  })
})
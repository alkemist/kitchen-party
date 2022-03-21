import { MeasureUnitKeyEnum } from '@enums';
import { QueryDocumentSnapshot } from '@firebase/firestore';
import { KitchenIngredientInterface, RecipeInterface } from '@interfaces';
import { ingredientLegumineMock, kitchenIngredientMock, kitchenIngredientRecipeMock, recipeMixedMock } from '@mocks';
import { kitchenIngredientConverter } from './kitchen-ingredient.converter';

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
    recipeId: recipeMixedMock.id,
    slug: recipeMixedMock.slug,
    ingredientId: '',
    quantity: 3,
    measure: '',
    unit: null,
    optionCarne: false,
    optionVege: false,
    optionVegan: false
  };

  it('toFirestore with ingredient', () => {
    expect(kitchenIngredientConverter.toFirestore(kitchenIngredientMock)).toEqual(kitchenIngredientInFirestore);
  });

  it('toFirestore with recipe', () => {
    expect(kitchenIngredientConverter.toFirestore(kitchenIngredientRecipeMock)).toEqual(kitchenIngredientRecipeInFirestore);
  });

  it('fromFirestore', () => {
    expect(kitchenIngredientConverter.fromFirestore(
      {
        data: () => {
          return kitchenIngredientInFirestore;
        }
      } as unknown as QueryDocumentSnapshot<RecipeInterface>
    )).toEqual(kitchenIngredientInFirestore);
  });
});

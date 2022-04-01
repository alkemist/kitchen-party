import { IngredientTypeKeyEnum } from '@enums';
import { QueryDocumentSnapshot } from '@firebase/firestore';
import { IngredientInterface, RecipeInterface } from '@interfaces';
import { ingredientLegumineMock, ingredientVegetableMock } from '@mocks';
import { ingredientConverter } from './ingredient.converter';

describe('ingredientConverter', () => {
  const ingredientVegetableInFirestore: IngredientInterface = {
    name: ingredientVegetableMock.name,
    slug: ingredientVegetableMock.slug,
    isLiquid: ingredientVegetableMock.isLiquid,
    monthBegin: ingredientVegetableMock.monthBegin,
    monthEnd: ingredientVegetableMock.monthEnd,
    type: IngredientTypeKeyEnum.fruits_vegetables_mushrooms
  };

  const ingredientInFirestore: IngredientInterface = {
    name: ingredientLegumineMock.name,
    slug: ingredientLegumineMock.slug,
    isLiquid: ingredientLegumineMock.isLiquid,
    monthBegin: null,
    monthEnd: null,
    type: IngredientTypeKeyEnum.cereals_legumines
  };

  it('toFirestore with date', () => {
    expect(ingredientConverter.toFirestore(ingredientVegetableMock)).toEqual(ingredientVegetableInFirestore);
  });
  it('toFirestore without date', () => {
    expect(ingredientConverter.toFirestore(ingredientLegumineMock)).toEqual(ingredientInFirestore);
  });
  it('fromFirestore', () => {
    expect(ingredientConverter.fromFirestore(
      {
        data: () => {
          return ingredientVegetableInFirestore;
        }
      } as unknown as QueryDocumentSnapshot<RecipeInterface>
    )).toEqual(ingredientVegetableInFirestore);
  });
});

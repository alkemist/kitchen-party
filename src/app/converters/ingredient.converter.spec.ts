import { QueryDocumentSnapshot } from '@firebase/firestore';
import { IngredientInterface, RecipeInterface } from '../interfaces';
import { ingredientConverter } from './ingredient.converter';
import { ingredientLegumineMock, ingredientVegetableMock } from '../mocks/ingredient.mock';
import { IngredientTypeKeyEnum } from '../enums';

describe('ingredientConverter', () => {
  const ingredientVegetableInFirestore: IngredientInterface = {
    name: 'Ingredient Vegetable 1',
    slug: 'ingredient-vegetable-1',
    isLiquid: false,
    monthBegin: 1,
    monthEnd: 3,
    type: IngredientTypeKeyEnum.fruits_vegetables_mushrooms
  };

  const ingredientInFirestore: IngredientInterface = {
    name: 'Ingredient Legumine 1',
    slug: 'ingredient-legumine-1',
    isLiquid: false,
    monthBegin: null,
    monthEnd: null,
    type: IngredientTypeKeyEnum.cereals_legumines
  };

  it('toFirestore with date', () => {
    expect(ingredientConverter.toFirestore(ingredientVegetableMock)).toEqual(ingredientVegetableInFirestore);
  })
  it('toFirestore without date', () => {
    expect(ingredientConverter.toFirestore(ingredientLegumineMock)).toEqual(ingredientInFirestore);
  })
  it('fromFirestore', () => {
    expect(ingredientConverter.fromFirestore(
      {
        data: () => {
          return ingredientVegetableInFirestore
        }
      } as unknown as QueryDocumentSnapshot<RecipeInterface>
    )).toEqual(ingredientVegetableInFirestore);
  })
})

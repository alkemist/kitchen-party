import { recipeConverter } from './recipe.converter';
import { recipeIngredientMock, recipeMeatMock } from '../mocks/recipe.mock';
import { MeasureUnitKeyEnum } from '../enums';
import { RecipeInterface } from '../interfaces';
import { ingredientLegumineMock, ingredientMeatMock } from '../mocks/ingredient.mock';
import { QueryDocumentSnapshot } from '@firebase/firestore';

describe('recipeConverter', () => {
  const recipeInFirestore: RecipeInterface = {
    name: 'Recipe Meat 1',
    slug: 'recipe-meat-1',
    cookingDuration: 0,
    preparationDuration: 0,
    waitingDuration: 0,
    source: '',
    nbSlices: 0,
    imagePath: '',
    type: null,
    instructions: [],
    image: undefined,
    recipeIngredients: [
      {
        ingredientId: ingredientLegumineMock.id,
        recipeId: '',
        quantity: 1,
        measure: '',
        unit: MeasureUnitKeyEnum.liter,
        optionCarne: false,
        optionVegan: false,
        optionVege: false,
      },
      {
        ingredientId: ingredientMeatMock.id,
        recipeId: '',
        quantity: 2,
        measure: '',
        unit: null,
        optionCarne: true,
        optionVegan: false,
        optionVege: false,
      },
      {
        recipeId: recipeIngredientMock.id,
        ingredientId: '',
        quantity: 3,
        measure: '',
        unit: null,
        optionCarne: false,
        optionVegan: false,
        optionVege: false,
      },
    ]
  };

  it('toFirestore', () => {
    expect(recipeConverter.toFirestore(recipeMeatMock)).toEqual(recipeInFirestore);
  })
  it('fromFirestore', () => {
    expect(recipeConverter.fromFirestore(
      {
        data: () => {
          return recipeInFirestore
        }
      } as unknown as QueryDocumentSnapshot<RecipeInterface>
    )).toEqual(recipeInFirestore);
  })
});

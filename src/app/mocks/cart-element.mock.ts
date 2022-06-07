import {
  ingredientAnimalFatMock,
  ingredientFishMock,
  ingredientLegumineMock,
  ingredientMeatMock,
  ingredientVegetableMock
} from '@app/mocks/ingredient.mock';
import { recipeIngredientVegetableMock } from '@app/mocks/recipe-ingredient.mock';
import { MeasureUnitLabelEnum } from '@enums';
import { CartElement } from '@interfaces';

const cartElementLegumineMock: CartElement = {
  inKitchen: false,
  ingredient: ingredientLegumineMock,
  quantity: '',
  quantities: {
    '': 0,
    'undefined': 0,
  }
};
cartElementLegumineMock.quantities[MeasureUnitLabelEnum.gram] = 600;
cartElementLegumineMock.quantities[MeasureUnitLabelEnum.milliliter] = 0;

const cartElementMeatMock: CartElement = {
  inKitchen: true,
  ingredient: ingredientMeatMock,
  quantity: '',
  quantities: {
    '': 0,
    'undefined': 0,
  }
};
cartElementMeatMock.quantities[MeasureUnitLabelEnum.gram] = 30;
cartElementMeatMock.quantities[MeasureUnitLabelEnum.milliliter] = 0;

const cartElementVegetableMock: CartElement = {
  inKitchen: true,
  ingredient: ingredientVegetableMock,
  quantity: '',
  quantities: {
    '': 0,
    'undefined': 0,
  }
};
cartElementVegetableMock.quantities[MeasureUnitLabelEnum.gram] = 0;
cartElementVegetableMock.quantities[MeasureUnitLabelEnum.milliliter] = 0;
cartElementVegetableMock.quantities[recipeIngredientVegetableMock.measure] = 3;

const cartElementFishMock: CartElement = {
  inKitchen: true,
  ingredient: ingredientFishMock,
  quantity: '',
  quantities: {
    '': 2,
    'undefined': 0,
  }
};
cartElementFishMock.quantities[MeasureUnitLabelEnum.gram] = 0;
cartElementFishMock.quantities[MeasureUnitLabelEnum.milliliter] = 0;

const cartElementAnimalFatMock: CartElement = {
  inKitchen: true,
  ingredient: ingredientAnimalFatMock,
  quantity: '',
  quantities: {
    '': 0,
    'undefined': 1,
  }
};
cartElementAnimalFatMock.quantities[MeasureUnitLabelEnum.gram] = 0;
cartElementAnimalFatMock.quantities[MeasureUnitLabelEnum.milliliter] = 0;

export {
  cartElementLegumineMock,
  cartElementMeatMock,
  cartElementVegetableMock,
  cartElementFishMock,
  cartElementAnimalFatMock
};
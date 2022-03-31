import { TestBed } from '@angular/core/testing';
import {
  cartElementAnimalFatMock,
  cartElementFishMock,
  cartElementLegumineMock,
  cartElementMeatMock,
  cartElementVegetableMock
} from '@app/mocks/cart-element.mock';
import {
  recipeIngredientAnimalFatMock,
  recipeIngredientFishMock,
  recipeIngredientLegumineMock,
  recipeIngredientMeatMock,
  recipeIngredientVegetableMock
} from '@app/mocks/recipe-ingredient.mock';
import { ObjectHelper } from '@app/tools/object.helper';
import { MeasureUnitLabelEnum } from '@enums';
import { CartElement } from '@interfaces';
import {
  ingredientLegumineMock,
  ingredientMeatMock,
  ingredientVegetableFatMock,
  ingredientVegetableMock,
  kitchenIngredientLegumineMock,
  kitchenIngredientMeatMock,
  kitchenIngredientVegetableFatMock,
  kitchenIngredientVegetableMock
} from '@mocks';
import { RecipeIngredientModel, RecipeModel } from '@models';
import { KitchenIngredientService, ShoppingService, TranslatorService } from '@services';
import { MockProvider } from 'ng-mocks';

describe('ShoppingService', () => {
  let service: ShoppingService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(KitchenIngredientService),
        MockProvider(TranslatorService),
      ]
    });
    service = TestBed.inject(ShoppingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('ShoppingService.cartOrderedByChecked', () => {
    it.each([
      {cart: [], expected: []},
      {
        cart: [ cartElementVegetableMock, cartElementLegumineMock, cartElementMeatMock ],
        expected: [ cartElementLegumineMock, cartElementMeatMock, cartElementVegetableMock ],
      },
    ])('should sort cart', ({cart, expected}) => {
      service.cart = cart;

      expect(service.cartOrderedByChecked).toEqual(expected);
    });
  });

  describe('ShoppingService.initIndexes', () => {
    it('should init indexes', async () => {
      service.kitchenIndexes = [];
      jest.spyOn(service['kitchenService'], 'getListOrRefresh').mockResolvedValue([
        kitchenIngredientLegumineMock,
        kitchenIngredientVegetableMock,
        kitchenIngredientMeatMock,
        kitchenIngredientVegetableFatMock,
      ]);

      await service.initIndexes();

      expect(service.kitchenIndexes).toEqual([
        ingredientLegumineMock.id,
        ingredientVegetableMock.id,
        ingredientMeatMock.id,
        ingredientVegetableFatMock.id,
      ]);
    });
  });

  describe('ShoppingService.initCart', () => {
    it('should init cart', () => {
      const multiplier = 2;

      service.initCart([
        new RecipeModel({recipeIngredients: [ recipeIngredientMeatMock ]}),
        new RecipeModel({
          recipeIngredients: [
            recipeIngredientLegumineMock,
            new RecipeIngredientModel({
              quantity: multiplier,
              recipe: new RecipeModel({
                recipeIngredients: [
                  recipeIngredientAnimalFatMock,
                  recipeIngredientMeatMock,
                  recipeIngredientFishMock
                ]
              })
            })
          ]
        })
      ]);

      const cartElementMeatGroupedMockExpected = {
        ...ObjectHelper.clone(cartElementMeatMock),
        inKitchen: false
      };
      cartElementMeatGroupedMockExpected.quantities[MeasureUnitLabelEnum.gram] *= multiplier + 1;

      const cartElementFishExpected = {
        ...ObjectHelper.clone(cartElementFishMock),
        inKitchen: false
      };
      cartElementFishExpected.quantities[''] *= multiplier;

      expect(service.cart).toEqual([
        cartElementMeatGroupedMockExpected,
        {...cartElementLegumineMock, inKitchen: false},
        {...cartElementAnimalFatMock, inKitchen: false},
        cartElementFishExpected,
      ]);
    });
  });

  describe('ShoppingService.addToCart', () => {
    it.each([
      {recipeIngredient: recipeIngredientLegumineMock, cartElement: cartElementLegumineMock},
      {recipeIngredient: recipeIngredientMeatMock, cartElement: cartElementMeatMock},
      {recipeIngredient: recipeIngredientVegetableMock, cartElement: cartElementVegetableMock},
      {recipeIngredient: recipeIngredientFishMock, cartElement: cartElementFishMock},
      {recipeIngredient: recipeIngredientAnimalFatMock, cartElement: cartElementAnimalFatMock},
    ])
    ('should add $recipeIngredient.id to cart', ({recipeIngredient, cartElement}) => {
      service.cart = [];

      service['addToCart'](recipeIngredient);

      expect(service.cart).toEqual(
        [ {...cartElement, inKitchen: false} ]
      );
    });
  });

  describe('ShoppingService.mergeCart', () => {
    const cartElementInKitchen: CartElement = {
      inKitchen: false,
      ingredient: ingredientLegumineMock,
      quantity: '',
      quantities: {
        '': 2,
        'undefined': 1,
      }
    };
    cartElementInKitchen.quantities[MeasureUnitLabelEnum.gram] = 3000;
    cartElementInKitchen.quantities[MeasureUnitLabelEnum.milliliter] = 4000;
    cartElementInKitchen.quantities['custom'] = 3;

    const cartElementNotInKitchen: CartElement = {
      ...cartElementInKitchen,
      ingredient: ingredientVegetableMock
    };

    beforeEach(() => {
      jest.spyOn(service['translatorService'], 'instant').mockImplementation(text => Promise.resolve(text));
    });

    it('should merge cart', async () => {
      service.kitchenIndexes = [
        ingredientLegumineMock.id!
      ];

      service.cart = [
        cartElementInKitchen,
        cartElementNotInKitchen
      ];

      const quantity = '2, ∞, 3000 Gram, 4000 Milliliter, 3 custom';

      await service.mergeCart();

      expect(service.cart).toEqual([
        {...cartElementInKitchen, inKitchen: true, quantity: quantity},
        {...cartElementNotInKitchen, inKitchen: false, quantity: quantity},
      ]);
    });
  });
});

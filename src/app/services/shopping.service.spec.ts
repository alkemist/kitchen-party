import { TestBed } from '@angular/core/testing';
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
    it('should sort cart', () => {
      service.cart = [];

      expect(service.cartOrderedByChecked).toEqual([]);
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { KitchenIngredientService } from './kitchen.service';

import { ShoppingService } from './shopping.service';
import { TranslatorService } from './translator.service';

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
});

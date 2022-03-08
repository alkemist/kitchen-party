import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { KitchenIngredientService } from '../services';
import { KitchenResolver } from './kitchen.resolver';

describe('KitchenResolver', () => {
  let kitchenServiceMock: KitchenIngredientService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        providers: [
          MockProvider(KitchenIngredientService)
        ]
      });

    kitchenServiceMock = TestBed.inject(KitchenIngredientService);
  });

  describe('KitchenResolver.constructor', function () {
    it('should construct', () => {
      expect(new KitchenResolver(kitchenServiceMock)).toBeDefined();
    });
  });
});
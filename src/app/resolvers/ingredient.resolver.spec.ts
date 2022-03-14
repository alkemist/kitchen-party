import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { IngredientService } from '@services';
import { IngredientResolver } from './ingredient.resolver';

describe('IngredientResolver', () => {
  let ingredientServiceMock: IngredientService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        providers: [
          MockProvider(IngredientService)
        ]
      });

    ingredientServiceMock = TestBed.inject(IngredientService);
  });

  describe('IngredientResolver.constructor', function () {
    it('should construct', () => {
      expect(new IngredientResolver(ingredientServiceMock)).toBeDefined();
    });
  });
});
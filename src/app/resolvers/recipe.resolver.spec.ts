import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { RecipeService } from '../services';
import { RecipeResolver } from './recipe.resolver';

describe('RecipeResolver', () => {
  let recipeServiceMock: RecipeService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        providers: [
          MockProvider(RecipeService)
        ]
      });

    recipeServiceMock = TestBed.inject(RecipeService);
  });

  describe('RecipeResolver.constructor', function () {
    it('should construct', () => {
      expect(new RecipeResolver(recipeServiceMock)).toBeDefined();
    });
  });
});
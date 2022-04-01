import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { RecipeService } from '@services';
import { RecipesResolver } from './recipes.resolver';

describe('RecipesResolver', () => {
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

  describe('RecipesResolver.constructor', () => {
    it('should construct', () => {
      expect(new RecipesResolver(recipeServiceMock)).toBeDefined();
    });
  });
});
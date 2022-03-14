import { TestBed } from '@angular/core/testing';

import { IngredientService, RecipeService, SearchService } from '@services';
import { MockProvider } from 'ng-mocks';

describe('SearchService', () => {
  let service: SearchService;
  let ingredientService: IngredientService;
  let recipeService: RecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(IngredientService),
        MockProvider(RecipeService),
      ]
    });
    service = TestBed.inject(SearchService);
    ingredientService = TestBed.inject(IngredientService);
    recipeService = TestBed.inject(RecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

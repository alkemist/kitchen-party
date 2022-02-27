import { TestBed } from '@angular/core/testing';

import { SearchService } from './search.service';
import { MockProvider } from 'ng-mocks';
import { IngredientService } from './ingredient.service';
import { RecipeService } from './recipe.service';

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

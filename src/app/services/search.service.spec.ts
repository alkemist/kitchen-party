import { TestBed } from '@angular/core/testing';
import { ingredientLegumineMock, recipeIngredientMock, recipeLegumineMock } from '@mocks';

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

  describe('SearchService.searchIngredientsOrRecipes', () => {
    let ingredientSearchSpy: jest.SpyInstance;
    let recipeSearchSpy: jest.SpyInstance;

    beforeEach(() => {
      ingredientSearchSpy = jest.spyOn(ingredientService, 'search').mockResolvedValue([ ingredientLegumineMock ]);
      recipeSearchSpy = jest.spyOn(recipeService, 'search').mockResolvedValue([ recipeLegumineMock, recipeIngredientMock ]);
    });

    it('should return results', async () => {
      const query = 'query';
      expect(await service.searchIngredientsOrRecipes(query)).toEqual([ ingredientLegumineMock, recipeIngredientMock ]);
      expect(ingredientSearchSpy).toHaveBeenCalledWith(query);
      expect(recipeSearchSpy).toHaveBeenCalledWith(query);
    });
  });
});

import { TestBed } from '@angular/core/testing';

import { ListIngredientApiService } from './list-ingredient-api.service';

describe('ListIngredientApiService', () => {
  let service: ListIngredientApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListIngredientApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

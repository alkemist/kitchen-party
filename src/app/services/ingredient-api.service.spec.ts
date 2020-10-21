import { TestBed } from '@angular/core/testing';

import { IngredientApiService } from './ingredient-api.service';

describe('IngredientApiService', () => {
  let service: IngredientApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { IngredientStoreService } from './ingredient-store.service';

describe('IngredientStoreService', () => {
  let service: IngredientStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

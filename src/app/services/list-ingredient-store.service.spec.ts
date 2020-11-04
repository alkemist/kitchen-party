import { TestBed } from '@angular/core/testing';

import { ListIngredientStoreService } from './list-ingredient-store.service';

describe('ListIngredientStoreService', () => {
  let service: ListIngredientStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListIngredientStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

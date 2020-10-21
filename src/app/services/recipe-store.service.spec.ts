import { TestBed } from '@angular/core/testing';

import { RecipeStoreService } from './recipe-store.service';

describe('RecipeStoreService', () => {
  let service: RecipeStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

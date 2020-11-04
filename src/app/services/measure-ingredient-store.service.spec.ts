import { TestBed } from '@angular/core/testing';

import { MeasureIngredientStoreService } from './measure-ingredient-store.service';

describe('MeasureIngredientStoreService', () => {
  let service: MeasureIngredientStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasureIngredientStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

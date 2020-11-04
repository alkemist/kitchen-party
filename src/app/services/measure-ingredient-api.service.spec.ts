import { TestBed } from '@angular/core/testing';

import { MeasureIngredientApiService } from './measure-ingredient-api.service';

describe('MeasureIngredientApiService', () => {
  let service: MeasureIngredientApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasureIngredientApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { productApiService } from './product-api.service';

describe('productApiService', () => {
  let service: productApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(productApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

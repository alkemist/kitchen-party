import { TestBed } from '@angular/core/testing';

import { ProductStoreService } from './product-store.service';

describe('ProductStoreService', () => {
  let service: ProductStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

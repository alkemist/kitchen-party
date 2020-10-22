import { TestBed } from '@angular/core/testing';

import { productStoreService } from './product-store.service';

describe('productStoreService', () => {
  let service: productStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(productStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

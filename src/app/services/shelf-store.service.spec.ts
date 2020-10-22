import { TestBed } from '@angular/core/testing';

import { ShelfStoreService } from './shelf-store.service';

describe('ShelfStoreService', () => {
  let service: ShelfStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShelfStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

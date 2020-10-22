import { TestBed } from '@angular/core/testing';

import { ListStoreService } from './list-store.service';

describe('ListStoreService', () => {
  let service: ListStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

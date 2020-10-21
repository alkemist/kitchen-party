import { TestBed } from '@angular/core/testing';

import { OperationStoreService } from './operation-store.service';

describe('OperationStoreService', () => {
  let service: OperationStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

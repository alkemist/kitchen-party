import { TestBed } from '@angular/core/testing';

import { MeasureOperationStoreService } from './measure-operation-store.service';

describe('MeasureOperationStoreService', () => {
  let service: MeasureOperationStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasureOperationStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { OperationApiService } from './operation-api.service';

describe('OperationApiService', () => {
  let service: OperationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

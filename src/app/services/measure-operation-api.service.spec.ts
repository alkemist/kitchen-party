import { TestBed } from '@angular/core/testing';

import { MeasureOperationApiService } from './measure-operation-api.service';

describe('MeasureOperationApiService', () => {
  let service: MeasureOperationApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasureOperationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

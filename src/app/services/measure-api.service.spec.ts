import { TestBed } from '@angular/core/testing';

import { MeasureApiService } from './measure-api.service';

describe('MeasureApiService', () => {
  let service: MeasureApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasureApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MeasureToolApiService } from './measure-tool-api.service';

describe('MeasureToolApiService', () => {
  let service: MeasureToolApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasureToolApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { MeasureStoreService } from './measure-store.service';

describe('MeasureStoreService', () => {
  let service: MeasureStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasureStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

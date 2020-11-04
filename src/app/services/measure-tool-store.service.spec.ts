import { TestBed } from '@angular/core/testing';

import { MeasureToolStoreService } from './measure-tool-store.service';

describe('MeasureToolStoreService', () => {
  let service: MeasureToolStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasureToolStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

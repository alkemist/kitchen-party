import { TestBed } from '@angular/core/testing';

import { FilteringService } from '@services';

describe('FilteringService', () => {
  let service: FilteringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilteringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

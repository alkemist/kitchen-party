import { TestBed } from '@angular/core/testing';

import { ShelfApiService } from './shelf-api.service';

describe('ShelfApiService', () => {
  let service: ShelfApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShelfApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

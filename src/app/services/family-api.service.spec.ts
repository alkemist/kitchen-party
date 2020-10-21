import { TestBed } from '@angular/core/testing';

import { FamilyApiService } from './family-api.service';

describe('FamilyApiService', () => {
  let service: FamilyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

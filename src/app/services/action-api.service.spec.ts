import { TestBed } from '@angular/core/testing';

import { ActionApiService } from './action-api.service';

describe('ActionApiService', () => {
  let service: ActionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

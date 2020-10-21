import { TestBed } from '@angular/core/testing';

import { ActionStoreService } from './action-store.service';

describe('ActionStoreService', () => {
  let service: ActionStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

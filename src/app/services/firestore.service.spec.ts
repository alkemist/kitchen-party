import {TestBed} from '@angular/core/testing';

import {DataObject, FirestoreService} from './firestore.service';

describe('FirestoreService', () => {
  let service: FirestoreService<DataObject>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { DataObjectInterface } from '../interfaces';

import { FirestoreService } from './firestore.service';

describe('FirestoreService', () => {
  let service: FirestoreService<DataObjectInterface>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

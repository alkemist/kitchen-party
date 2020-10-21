import { TestBed } from '@angular/core/testing';

import { ToolStoreService } from './tool-store.service';

describe('ToolStoreService', () => {
  let service: ToolStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

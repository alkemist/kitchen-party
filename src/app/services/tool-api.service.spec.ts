import { TestBed } from '@angular/core/testing';

import { ToolApiService } from './tool-api.service';

describe('ToolApiService', () => {
  let service: ToolApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

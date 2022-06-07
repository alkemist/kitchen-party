import { TestBed } from '@angular/core/testing';

import { LoggerService, UploadService } from '@services';
import { MockProvider } from 'ng-mocks';

jest.mock('firebase/storage', () => ({
  ...(jest.requireActual('firebase/storage')),
  getDownloadURL: jest.fn(),
  getStorage: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
}));

describe('UploadService', () => {
  let service: UploadService;
  let loggerService: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(LoggerService)
      ]
    });
    service = TestBed.inject(UploadService);
    loggerService = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

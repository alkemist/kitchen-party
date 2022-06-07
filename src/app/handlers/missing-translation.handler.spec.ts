import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { LoggerService } from '@services';
import { AppMissingTranslationHandler } from './missing-translation.handler';

describe('AppMissingTranslationHandler', () => {
  let loggerServiceMock: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(LoggerService)
      ]
    });
    loggerServiceMock = TestBed.inject(LoggerService);
  });

  describe('AppMissingTranslationHandler.constructor', () => {
    it('should construct', () => {
      expect(new AppMissingTranslationHandler(loggerServiceMock)).toBeDefined();
    });
  });
});
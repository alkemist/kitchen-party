import { TestBed } from '@angular/core/testing';

import { TranslatorService } from './translator.service';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslationState } from '../stores/translation.state';
import { MockProvider } from 'ng-mocks';
import { LoggerService } from './logger.service';
import { TranslateService } from '@ngx-translate/core';

describe('TranslatorService', () => {
  let service: TranslatorService;
  let loggerService: LoggerService;
  let translateService: TranslateService;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ TranslationState ], {
          developmentMode: true
        })
      ],
      providers: [
        MockProvider(LoggerService),
        MockProvider(TranslateService),
      ]
    });
    service = TestBed.inject(TranslatorService);
    loggerService = TestBed.inject(LoggerService);
    translateService = TestBed.inject(TranslateService);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

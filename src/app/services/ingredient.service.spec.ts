import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';

import { IngredientService, LoggerService } from '@services';
import { IngredientState } from '@stores';
import { MockProvider } from 'ng-mocks';

describe('IngredientService', () => {
  let service: IngredientService;
  let store: Store;
  let loggerService: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ IngredientState ], {
          developmentMode: true
        })
      ],
      providers: [
        MockProvider(LoggerService),
      ]
    });
    service = TestBed.inject(IngredientService);
    store = TestBed.inject(Store);
    loggerService = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

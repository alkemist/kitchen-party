import { TestBed } from '@angular/core/testing';
import { KitchenIngredientService } from './kitchen.service';
import { NgxsModule, Store } from '@ngxs/store';
import { MockProvider } from 'ng-mocks';
import { LoggerService } from './logger.service';
import { KitchenIngredientState } from '../stores/kitchen.state';


describe('KitchenIngredientService', () => {
  let service: KitchenIngredientService;
  let store: Store;
  let loggerService: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ KitchenIngredientState ], {
          developmentMode: true
        })
      ],
      providers: [
        MockProvider(LoggerService),
      ]
    });
    service = TestBed.inject(KitchenIngredientService);
    store = TestBed.inject(Store);
    loggerService = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

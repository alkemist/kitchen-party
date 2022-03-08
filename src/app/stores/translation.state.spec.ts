import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { FillTranslations } from './translation.action';
import { TranslationState } from './translation.state';

describe('TranslationState', () => {
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ TranslationState ], {
          developmentMode: true
        })
      ],
    });

    store = TestBed.inject(Store);
  });

  describe('TranslationState.fill', () => {
    beforeEach(async () => {
      store.dispatch(new FillTranslations([]));
    });

    it('should fill translations', () => {
      const translationsSelected = store.selectSnapshot((state) => state.translations.all);
      expect(translationsSelected).toEqual([]);
    });
  });
});

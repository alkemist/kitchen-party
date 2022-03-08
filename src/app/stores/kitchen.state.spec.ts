import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { FillKitchenIngredients } from './kitchen.action';
import { KitchenIngredientState } from './kitchen.state';

describe('KitchenIngredientState', () => {
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ KitchenIngredientState ], {
          developmentMode: true
        })
      ],
    });

    store = TestBed.inject(Store);
  });

  describe('KitchenIngredientState.fill', () => {
    beforeEach(async () => {
      store.dispatch(new FillKitchenIngredients([]));
    });

    it('should fill kitchenIngredients', () => {
      const kitchenIngredientsSelected = store.selectSnapshot((state) => state.kitchenIngredients.all);
      expect(kitchenIngredientsSelected).toEqual([]);
    });
  });
});

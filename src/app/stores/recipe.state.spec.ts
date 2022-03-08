import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { FillRecipes } from './recipe.action';
import { RecipeState } from './recipe.state';

describe('RecipeState', () => {
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ RecipeState ], {
          developmentMode: true
        })
      ],
    });

    store = TestBed.inject(Store);
  });

  describe('RecipeState.fill', () => {
    beforeEach(async () => {
      store.dispatch(new FillRecipes([]));
    });

    it('should fill recipes', () => {
      const recipesSelected = store.selectSnapshot((state) => state.recipes.all);
      expect(recipesSelected).toEqual([]);
    });
  });
});

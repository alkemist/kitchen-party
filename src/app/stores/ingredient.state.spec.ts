import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { IngredientInterface } from '../interfaces';
import { AddIngredient, FillIngredients, RemoveIngredient, UpdateIngredient } from './ingredient.action';
import { IngredientState } from './ingredient.state';

describe('IngredientState', () => {
  let store: Store;
  let ingredientsSelected;
  const updatedDate = new Date('1984-08-04 12:12');

  const currentIngredient = { id: '1', slug: '1' } as IngredientInterface;
  const newIngredient = { id: '2', slug: '2' } as IngredientInterface;
  const ingredientUpdated = { ...currentIngredient, name: currentIngredient.slug } as IngredientInterface;
  const fruitWithSeasonIngredient = {
    id: '3',
    slug: '3',
    type: 'fruits_vegetables_mushrooms',
    monthBegin: 1,
    monthEnd: 2
  } as IngredientInterface;
  const fruitIngredient = { id: '4', slug: '4', type: 'fruits_vegetables_mushrooms' } as IngredientInterface;

  const ingredientsSimple = [ currentIngredient ] as IngredientInterface[];
  const ingredientsComplete = [ currentIngredient, fruitWithSeasonIngredient, fruitIngredient, newIngredient ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ IngredientState ], {
          developmentMode: true
        })
      ],
    });

    store = TestBed.inject(Store);
  });

  describe('actions', () => {
    beforeEach(async () => {
      store.dispatch(new FillIngredients(ingredientsSimple));
    });

    it('should fill ingredients', () => {
      ingredientsSelected = store.selectSnapshot((state) => state.ingredients.all);
      expect(ingredientsSelected).toEqual(ingredientsSimple);
    });

    it('should add ingredient', () => {
      store.dispatch(new AddIngredient(newIngredient));

      ingredientsSelected = store.selectSnapshot((state) => state.ingredients.all);
      expect(ingredientsSelected).toEqual([ ...ingredientsSimple, newIngredient ]);
    });

    it('should update ingredient', () => {
      store.dispatch(new UpdateIngredient(ingredientUpdated));

      ingredientsSelected = store.selectSnapshot((state) => state.ingredients.all);
      expect(ingredientsSelected).toEqual([ ingredientUpdated ]);
    });

    it('should remove ingredient', () => {
      store.dispatch(new RemoveIngredient(currentIngredient));

      ingredientsSelected = store.selectSnapshot((state) => state.ingredients.all);
      expect(ingredientsSelected).toEqual([]);
    });
  })

  describe('selectors', () => {
    it('should select all ingredients', () => {
      expect(IngredientState.all({ all: ingredientsComplete })).toEqual(ingredientsComplete);
    });

    it('should get last updated store date', () => {
      expect(IngredientState.lastUpdated({ lastUpdated: updatedDate, all: [] })).toEqual(updatedDate);
    });

    it('should select fruits and vegetables with saisons', () => {
      expect(IngredientState.fruitsOrVegetables({ all: ingredientsComplete })).toEqual([ fruitWithSeasonIngredient ]);
    });

    it('should get ingredient by slug', () => {
      expect(IngredientState.getIngredientBySlug({ all: ingredientsComplete }, newIngredient.slug)).toEqual(newIngredient);
    });
  })
});

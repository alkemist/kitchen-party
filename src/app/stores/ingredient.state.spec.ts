import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { IngredientInterface } from '../interfaces';
import { AddIngredient, FillIngredients, RemoveIngredient, UpdateIngredient } from './ingredient.action';
import { IngredientState } from './ingredient.state';

describe('IngredientState', () => {
  let store: Store;
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

  it('should action', () => {
    let ingredientsSelected;
    const updatedDate = new Date('1984-08-04 12:12');

    const currentIngredient = {id: '1', slug: '1'} as IngredientInterface;
    let ingredients = [ currentIngredient ] as IngredientInterface[];
    store.dispatch(new FillIngredients(ingredients));

    ingredientsSelected = store.selectSnapshot((state) => state.ingredients.all);
    expect(ingredientsSelected).toEqual(ingredients);

    const newIngredient = {id: '2', slug: '2'} as IngredientInterface;
    store.dispatch(new AddIngredient(newIngredient));

    ingredientsSelected = store.selectSnapshot((state) => state.ingredients.all);
    expect(ingredientsSelected).toEqual([ ...ingredients, newIngredient ]);

    const ingredientUpdated = {...newIngredient, name: '2'} as IngredientInterface;
    store.dispatch(new UpdateIngredient(ingredientUpdated));

    ingredientsSelected = store.selectSnapshot((state) => state.ingredients.all);
    expect(ingredientsSelected).toEqual([ ...ingredients, ingredientUpdated ]);

    store.dispatch(new RemoveIngredient(currentIngredient));

    ingredientsSelected = store.selectSnapshot((state) => state.ingredients.all);
    expect(ingredientsSelected).toEqual([ ingredientUpdated ]);

    ingredients = [ currentIngredient, newIngredient ];
    expect(IngredientState.all({all: ingredients})).toEqual(ingredients);
    expect(IngredientState.lastUpdated({lastUpdated: updatedDate, all: []})).toEqual(updatedDate);
    expect(IngredientState.fruitsOrVegetables({all: ingredients})).toEqual(ingredients);
    expect(IngredientState.getIngredientBySlug({all: ingredients}, '2')).toEqual(ingredients);
  });
});
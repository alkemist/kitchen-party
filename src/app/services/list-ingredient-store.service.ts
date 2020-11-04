import { Injectable } from '@angular/core';
import {GenericStoreService} from '../generics/generic-store.service';
import {ListIngredientInterface} from '../interfaces/list';
import {IngredientApiService} from './ingredient-api.service';
import {FamilyStoreService} from './family-store.service';
import {ListIngredientApiService} from './list-ingredient-api.service';
import {IngredientStoreService} from './ingredient-store.service';
import {IngredientInterface} from '../interfaces/ingredient';
import {ListStoreService} from './list-store.service';

@Injectable({
  providedIn: 'root'
})
export class ListIngredientStoreService extends GenericStoreService<ListIngredientInterface>{
  entityName = 'list_ingredient';
  constructor(
    private listIngredientService: ListIngredientApiService,
    private ingredientStore: IngredientStoreService
  ) {
    super(listIngredientService);
  }

  protected hydrate(listIngredient: ListIngredientInterface): Promise<ListIngredientInterface> {
    return new Promise<ListIngredientInterface>((resolve) => {
      const promises: Promise<ListIngredientInterface>[] = [];

      if (listIngredient.ingredientId && !listIngredient.ingredient) {
        promises.push(new Promise<ListIngredientInterface>((resolveIngredient) => {
          this.ingredientStore.find(listIngredient.ingredientId).then(ingredient => {
            listIngredient.ingredient = ingredient;
            resolveIngredient(listIngredient);
          });
        }));
      }

      if (promises.length > 0) {
        return Promise.all(promises).then(listIngredients => {
          const listIngredientHydrated = Object.assign({}, ...listIngredients);
          this.setEntity(listIngredientHydrated);
          resolve(listIngredientHydrated);
        });
      } else {
        this.setEntity(listIngredient);
        resolve(listIngredient);
      }
    });
  }
}

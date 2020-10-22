import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {IngredientInterface} from '../interfaces/ingredient';
import {IngredientApiService} from './ingredient-api.service';
import {FamilyStoreService} from './family-store.service';
import {GenericStoreService} from '../generics/generic-store.service';

@Injectable({
  providedIn: 'root'
})
export class IngredientStoreService extends GenericStoreService<IngredientInterface>{
  entityName = 'ingredient';
  constructor(private ingredientService: IngredientApiService, private familyStore: FamilyStoreService) {
    super(ingredientService);
  }

  protected hydrate(ingredient: IngredientInterface): Promise<IngredientInterface> {
    return new Promise<IngredientInterface>((resolve) => {
      const promises: Promise<IngredientInterface>[] = [];

      if (ingredient.familyId && !ingredient.family) {
        promises.push(new Promise<IngredientInterface>((resolveFamily) => {
          this.familyStore.find(ingredient.familyId).then(family => {
            ingredient.family = family;
            resolveFamily(ingredient);
          });
        }));
      }

      if (promises.length > 0) {
        return Promise.all(promises).then(ingredients => {
          const ingredientHydrated = Object.assign({}, ...ingredients);
          console.log('[STORE]', 'ingredient', 'hydrated', ingredientHydrated);
          this.setEntity(ingredientHydrated);
          resolve(ingredientHydrated);
        });
      } else {
        this.setEntity(ingredient);
        resolve(ingredient);
      }
    });
  }
}

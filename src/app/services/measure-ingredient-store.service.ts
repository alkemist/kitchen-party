import { Injectable } from '@angular/core';
import {GenericStoreService} from '../generics/generic-store.service';
import {MeasureIngredientInterface} from '../interfaces/operation';
import {MeasureIngredientApiService} from './measure-ingredient-api.service';
import {IngredientStoreService} from './ingredient-store.service';
import {MeasureStoreService} from './measure-store.service';

@Injectable({
  providedIn: 'root'
})
export class MeasureIngredientStoreService extends GenericStoreService<MeasureIngredientInterface>{
  entityName = 'measure_ingredient';
  constructor(private measureIngredientService: MeasureIngredientApiService,
              private measureStore: MeasureStoreService,
              private ingredientStore: IngredientStoreService
  ) {
    super(measureIngredientService);
  }

  protected hydrate(measureIngredient: MeasureIngredientInterface): Promise<MeasureIngredientInterface> {
    return new Promise<MeasureIngredientInterface>((resolve) => {
      const promises: Promise<MeasureIngredientInterface>[] = [];

      if (measureIngredient.measureId && !measureIngredient.measure) {
        promises.push(new Promise<MeasureIngredientInterface>((resolveMeasure) => {
          this.measureStore.find(measureIngredient.measureId).then(measure => {
            measureIngredient.measure = measure;
            resolveMeasure(measureIngredient);
          });
        }));
      }

      if (measureIngredient.ingredientId && !measureIngredient.ingredient) {
        promises.push(new Promise<MeasureIngredientInterface>((resolveIngredient) => {
          this.ingredientStore.find(measureIngredient.ingredientId).then(ingredient => {
            measureIngredient.ingredient = ingredient;
            resolveIngredient(measureIngredient);
          });
        }));
      }

      if (promises.length > 0) {
        return Promise.all(promises).then(measureIngredients => {
          const measureIngredientHydrated = Object.assign({}, ...measureIngredients);
          this.setEntity(measureIngredientHydrated);
          resolve(measureIngredientHydrated);
        });
      } else {
        this.setEntity(measureIngredient);
        resolve(measureIngredient);
      }
    });
  }
}

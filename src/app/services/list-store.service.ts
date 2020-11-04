import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ListInterface} from '../interfaces/list';
import {ListApiService} from './list-api.service';
import {GenericStoreService} from '../generics/generic-store.service';
import {MeasureInterface} from '../interfaces/measure';
import {ListIngredientStoreService} from './list-ingredient-store.service';

@Injectable({
  providedIn: 'root'
})
export class ListStoreService extends GenericStoreService<ListInterface> {
  entityName = 'list';
  constructor(private listService: ListApiService, private listIngredientStore: ListIngredientStoreService) {
    super(listService);
  }

  protected hydrate(list: ListInterface): Promise<ListInterface> {
    return new Promise<ListInterface>((resolve) => {
      const promises: Promise<ListInterface>[] = [];

      if (list.ingredientIds && list.ingredients.length === 0) {
        list.ingredientIds.forEach(ingredientId => {
          promises.push(new Promise<ListInterface>((resolveListIngredient) => {
            this.listIngredientStore.find(ingredientId).then(listIngredient => {
              list.ingredients.push(listIngredient);
              resolveListIngredient(list);
            });
          }));
        });
      }

      if (promises.length > 0) {
        return Promise.all(promises).then(lists => {
          const listHydrated = Object.assign({}, ...lists);
          this.setEntity(listHydrated);
          resolve(listHydrated);
        });
      } else {
        this.setEntity(list);
        resolve(list);
      }
    });
  }
}

import { Injectable } from '@angular/core';
import {RecipeInterface} from '../interfaces/recipe';
import {RecipeApiService} from './recipe-api.service';
import {GenericStoreService} from '../generics/generic-store.service';
import {OperationStoreService} from './operation-store.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeStoreService extends GenericStoreService<RecipeInterface> {
  entityName = 'recipe';
  constructor(private recipeService: RecipeApiService, private operationStore: OperationStoreService) {
    super(recipeService);
  }

  protected hydrate(recipe: RecipeInterface): Promise<RecipeInterface> {
    return new Promise<RecipeInterface>((resolve) => {
      const promises: Promise<RecipeInterface>[] = [];

      if (recipe.operationIds && !recipe.operations) {
        recipe.operations = [];
        recipe.operationIds.forEach(operationId => {
          promises.push(new Promise<RecipeInterface>((resolveOperation) => {
            this.operationStore.find(operationId).then(operation => {
              recipe.operations.push(operation);
              resolveOperation(recipe);
            });
          }));
        });
      }

      if (promises.length > 0) {
        return Promise.all(promises).then(recipes => {
          const recipeHydrated = Object.assign({}, ...recipes);
          this.setEntity(recipeHydrated);
          resolve(recipeHydrated);
        });
      } else {
        this.setEntity(recipe);
        resolve(recipe);
      }
    });
  }
}

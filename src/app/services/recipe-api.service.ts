import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RecipeInterface} from '../interfaces/recipe';
import {GenericApiService} from '../generics/generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeApiService extends GenericApiService<RecipeInterface>{
  entityName = 'recipe';
  constructor(protected http: HttpClient) {
    super(http);
  }

  protected clearEntity(recipe: RecipeInterface): RecipeInterface {
    const recipeCleared =  Object.assign({}, recipe);

    if (recipeCleared.operations.length > 0) {
      const operationIds = [];
      recipeCleared.operations.forEach(operation => {
        operationIds.push(operation.id);
      });
      recipeCleared.operationIds = operationIds;
      delete recipeCleared.operations;
    }

    return recipeCleared;
  }
}

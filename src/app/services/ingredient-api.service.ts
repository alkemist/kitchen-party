import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IngredientInterface} from '../interfaces/ingredient';
import {GenericApiService} from '../generics/generic-api.service';
import {MeasureInterface} from '../interfaces/measure';

@Injectable({
  providedIn: 'root'
})
export class IngredientApiService extends GenericApiService<IngredientInterface>{
  entityName = 'ingredient';
  constructor(protected http: HttpClient) {
    super(http);
  }

  protected clearEntity(ingredient: IngredientInterface): IngredientInterface {
    const ingredientCleared =  Object.assign({}, ingredient);

    if (typeof ingredientCleared.family === 'object') {
      ingredientCleared.familyId = ingredientCleared.family.id;
      delete ingredientCleared.family;
    }

    return ingredientCleared;
  }
}

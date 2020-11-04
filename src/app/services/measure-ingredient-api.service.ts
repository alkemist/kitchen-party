import { Injectable } from '@angular/core';
import {GenericApiService} from '../generics/generic-api.service';
import {MeasureIngredientInterface} from '../interfaces/operation';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeasureIngredientApiService extends GenericApiService<MeasureIngredientInterface>{
  entityName = 'measure_ingredient';
  constructor(protected http: HttpClient) {
    super(http);
  }

  protected clearEntity(measureIngredient: MeasureIngredientInterface): MeasureIngredientInterface {
    const measureIngredientCleared =  Object.assign({}, measureIngredient);

    if (typeof measureIngredientCleared.measure === 'object') {
      measureIngredientCleared.measureId = measureIngredientCleared.measure.id;
      delete measureIngredientCleared.measure;
    }
    if (typeof measureIngredientCleared.ingredient === 'object') {
      measureIngredientCleared.ingredientId = measureIngredientCleared.ingredient.id;
      delete measureIngredientCleared.ingredient;
    }

    return measureIngredientCleared;
  }
}

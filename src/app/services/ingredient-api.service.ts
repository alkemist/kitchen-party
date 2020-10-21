import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IngredientInterface} from '../interfaces/ingredient';
import {GenericApiService} from '../generics/generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class IngredientApiService extends GenericApiService<IngredientInterface>{
  entityName = 'ingredient';
  constructor(protected http: HttpClient) {
    super(http);
  }
}

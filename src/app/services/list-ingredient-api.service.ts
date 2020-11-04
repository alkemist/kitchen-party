import { Injectable } from '@angular/core';
import {GenericApiService} from '../generics/generic-api.service';
import {HttpClient} from '@angular/common/http';
import {ListIngredientInterface} from '../interfaces/list';

@Injectable({
  providedIn: 'root'
})
export class ListIngredientApiService extends GenericApiService<ListIngredientInterface>{
  entityName = 'list_ingredient';
  constructor(protected http: HttpClient) {
    super(http);
  }
}

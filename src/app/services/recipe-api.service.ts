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
}

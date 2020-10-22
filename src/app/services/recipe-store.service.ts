import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {RecipeInterface} from '../interfaces/recipe';
import {RecipeApiService} from './recipe-api.service';
import {GenericStoreService} from '../generics/generic-store.service';
import {IngredientInterface} from '../interfaces/ingredient';

@Injectable({
  providedIn: 'root'
})
export class RecipeStoreService extends GenericStoreService<RecipeInterface> {
  entityName = 'recipe';
  constructor(private recipeService: RecipeApiService) {
    super(recipeService);
  }
}

import { Injectable } from '@angular/core';
import { RecipeModel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  selectedRecipes: RecipeModel[] = [];

  constructor() {
  }
}

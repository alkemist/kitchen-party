import {Injectable} from '@angular/core';
import {RecipeModel} from "../models/recipe.model";

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  selectedRecipes: RecipeModel[] = [];

  constructor() {
  }
}

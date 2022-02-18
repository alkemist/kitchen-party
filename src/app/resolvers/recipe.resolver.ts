import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RecipeInterface } from '../interfaces/recipe.interface';
import { RecipeModel } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';

@Injectable({providedIn: 'root'})
export class RecipeResolver implements Resolve<RecipeModel> {
  constructor(private service: RecipeService) {
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<RecipeModel> {
    const recipe = await this.service.get(route.paramMap.get('slug') ?? '');
    if (recipe) {
      return recipe;
    }
    return new RecipeModel({} as RecipeInterface);
  }
}

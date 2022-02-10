import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {IngredientInterface, IngredientModel} from '../models/ingredient.model';
import {IngredientService} from '../services/ingredient.service';

@Injectable({providedIn: 'root'})
export class IngredientResolver implements Resolve<IngredientModel> {
  constructor(private service: IngredientService) {
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<IngredientModel> {
    const ingredient = await this.service.get(route.paramMap.get('slug') ?? '', true);
    if (ingredient) {
      return ingredient;
    }
    return new IngredientModel({} as IngredientInterface);
  }
}

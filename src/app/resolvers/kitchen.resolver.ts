import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { KitchenIngredientInterface } from '../interfaces';
import { KitchenIngredientModel } from '../models';
import { KitchenIngredientService } from '../services';

@Injectable({ providedIn: 'root' })
export class KitchenResolver implements Resolve<KitchenIngredientModel> {
  constructor(private service: KitchenIngredientService) {
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<KitchenIngredientModel> {
    const kitchenIngredient = await this.service.get(route.paramMap.get('slug') ?? '');
    if (kitchenIngredient) {
      return kitchenIngredient;
    }
    return new KitchenIngredientModel({} as KitchenIngredientInterface);
  }
}

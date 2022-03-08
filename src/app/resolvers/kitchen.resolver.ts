import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { KitchenIngredientModel } from '../models';
import { KitchenIngredientService } from '../services';

@Injectable({providedIn: 'root'})
export class KitchenResolver implements Resolve<KitchenIngredientModel | undefined> {
  constructor(private service: KitchenIngredientService) {
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<KitchenIngredientModel | undefined> {
    const kitchenIngredient = await this.service.get(route.paramMap.get('slug') ?? '');
    if (kitchenIngredient) {
      return kitchenIngredient;
    }
    return undefined;
  }
}

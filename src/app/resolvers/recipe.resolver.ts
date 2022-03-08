import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RecipeModel } from '../models';
import { RecipeService } from '../services';

@Injectable({providedIn: 'root'})
export class RecipeResolver implements Resolve<RecipeModel | undefined> {
  constructor(private service: RecipeService) {
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<RecipeModel | undefined> {
    return await this.service.get(route.paramMap.get('slug') ?? '');
  }
}

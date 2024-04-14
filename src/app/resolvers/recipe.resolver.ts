import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { RecipeModel } from '@models';
import { RecipeService, RecipeV2Service } from '@services';

@Injectable({ providedIn: 'root' })
export class RecipeResolver implements Resolve<RecipeModel | undefined> {
  constructor(private service: RecipeService) {
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<RecipeModel | undefined> {
    return await this.service.getBySlug(route.paramMap.get('slug') ?? '');
  }
}

export const recipeResolver: ResolveFn<void | null> =
  async (route: ActivatedRouteSnapshot) => {
    return inject(RecipeV2Service).dispatchUserItem(route.paramMap.get('slug')!);
  };

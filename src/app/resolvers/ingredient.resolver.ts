import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { IngredientV2Service } from '@services';

export const ingredientResolver: ResolveFn<void | null> =
  async (route: ActivatedRouteSnapshot) => {
    return inject(IngredientV2Service).dispatchUserItem(route.paramMap.get('slug')!);
  };

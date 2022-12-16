import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {RecipeModel} from '@models';
import {RecipeService} from '@services';

@Injectable({providedIn: 'root'})
export class RecipesResolver implements Resolve<RecipeModel[]> {
  constructor(private service: RecipeService) {
  }

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<RecipeModel[]> {
    const slugs = route.paramMap.get('slugs')?.split(',')!;
    const recipes: RecipeModel[] = [];

    if (slugs.length > 0) {
      for (const slug of slugs) {
        const recipe = await this.service.getBySlug(slug);
        if (recipe) {
          recipes.push(recipe);
        }
      }
    }
    return recipes;
  }
}

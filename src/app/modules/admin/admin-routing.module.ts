import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  IngredientComponent,
  IngredientsComponent,
  KitchenIngredientComponent,
  KitchenIngredientsComponent,
  RecipeComponent,
  RecipesComponent
} from '@components';
import { LoggedGuard } from '@guards';
import { IngredientResolver, KitchenResolver, RecipeResolver } from '@resolvers';

const routes: Routes = [
  {path: '', redirectTo: '/admin/recipes', pathMatch: 'full'},
  {
    path: 'ingredients',
    component: IngredientsComponent,
    canActivate: [ LoggedGuard ],
    data: {title: 'Ingredients'}
  },
  {
    path: 'ingredient/:slug',
    component: IngredientComponent,
    resolve: {
      ingredient: IngredientResolver
    },
    data: {title: 'Ingredient'},
  },
  {
    path: 'ingredient',
    component: IngredientComponent,
    data: {title: 'Ingredient'},
  },
  {
    path: 'recipes',
    component: RecipesComponent,
    canActivate: [ LoggedGuard ],
    data: {title: 'Recipes'}
  },
  {
    path: 'recipe/:slug',
    component: RecipeComponent,
    resolve: {
      recipe: RecipeResolver
    },
    canActivate: [ LoggedGuard ],
    data: {title: 'Recipe'},
  },
  {
    path: 'recipe',
    component: RecipeComponent,
    canActivate: [ LoggedGuard ],
    data: {title: 'Recipe'},
  },
  {
    path: 'kitchen-ingredients',
    component: KitchenIngredientsComponent,
    canActivate: [ LoggedGuard ],
    data: {title: 'Kitchen ingredients'}
  },
  {
    path: 'kitchen-ingredient/:slug',
    component: KitchenIngredientComponent,
    resolve: {
      kitchenIngredient: KitchenResolver
    },
    canActivate: [ LoggedGuard ],
    data: {title: 'Kitchen ingredient'},
  },
  {
    path: 'kitchen-ingredient',
    component: KitchenIngredientComponent,
    canActivate: [ LoggedGuard ],
    data: {title: 'Kitchen ingredient'},
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class AdminRoutingModule {
}

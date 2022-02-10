import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IngredientComponent} from '../components/views/backend/ingredient/ingredient.component';
import {IngredientsComponent} from '../components/views/backend/ingredients/ingredients.component';
import {KitchenIngredientComponent} from '../components/views/backend/kitchen-ingredient/kitchen-ingredient.component';
import {
  KitchenIngredientsComponent
} from '../components/views/backend/kitchen-ingredients/kitchen-ingredients.component';
import {RecipeComponent} from '../components/views/backend/recipe/recipe.component';
import {RecipesComponent} from '../components/views/backend/recipes/recipes.component';
import {FrontRecipeComponent} from '../components/views/frontend/recipe/recipe.component';
import {FrontRecipesComponent} from '../components/views/frontend/recipes/recipes.component';
import {ShoppingComponent} from '../components/views/frontend/shopping/shopping.component';
import {LoginComponent} from '../components/views/user/login/login.component';
import {LoggedGuard} from '../guards/logged.guard';
import {LoginGuard} from '../guards/login.guard';
import {IngredientResolver} from '../resolvers/ingredient.resolver';
import {KitchenResolver} from '../resolvers/kitchen.resolver';
import {RecipeResolver} from '../resolvers/recipe.resolver';
import {RecipesResolver} from '../resolvers/recipes.resolver';
import {UserService} from '../services/user.service';

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard], data: {title: 'Login'}},
  {path: 'logged', redirectTo: '/ingredients', pathMatch: 'full'},
  {
    path: 'ingredients',
    component: IngredientsComponent,
    canActivate: [LoggedGuard],
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
    canActivate: [LoggedGuard],
    data: {title: 'Recipes'}
  },
  {
    path: 'recipe/:slug',
    component: RecipeComponent,
    resolve: {
      recipe: RecipeResolver
    },
    canActivate: [LoggedGuard],
    data: {title: 'Recipe'},
  },
  {
    path: 'recipe',
    component: RecipeComponent,
    canActivate: [LoggedGuard],
    data: {title: 'Recipe'},
  },
  {
    path: 'kitchen-ingredients',
    component: KitchenIngredientsComponent,
    canActivate: [LoggedGuard],
    data: {title: 'Kitchen ingredients'}
  },
  {
    path: 'kitchen-ingredient/:slug',
    component: KitchenIngredientComponent,
    resolve: {
      recipe: KitchenResolver
    },
    canActivate: [LoggedGuard],
    data: {title: 'Kitchen ingredient'},
  },
  {
    path: 'kitchen-ingredient',
    component: KitchenIngredientComponent,
    canActivate: [LoggedGuard],
    data: {title: 'Kitchen ingredient'},
  },
  {
    path: 'shopping/:slugs', component: ShoppingComponent,
    resolve: {
      recipes: RecipesResolver
    },
    data: {title: 'Shopping list'}
  },
  {
    path: ':slug', component: FrontRecipeComponent,
    resolve: {
      recipe: RecipeResolver
    },
    data: {title: 'Recipe', hideHeader: true, enableNoSleep: true}
  },
  {path: '', component: FrontRecipesComponent, data: {showFilters: true}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoggedGuard, UserService]
})
export class RoutingModule {
}

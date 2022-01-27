import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from '../components/views/kitchen/index/index.component';
import {IngredientComponent} from '../components/views/kitchen/ingredient/ingredient.component';
import {IngredientsComponent} from '../components/views/kitchen/ingredients/ingredients.component';
import {RecipeComponent} from '../components/views/kitchen/recipe/recipe.component';
import {RecipesComponent} from '../components/views/kitchen/recipes/recipes.component';
import {LoginComponent} from '../components/views/user/login/login.component';
import {LoggedGuard} from '../guards/logged.guard';
import {LoginGuard} from '../guards/login.guard';
import {IngredientResolver} from '../resolvers/ingredient.resolver';
import {RecipeResolver} from '../resolvers/recipe.resolver';
import {UserService} from '../services/user.service';

const routes: Routes = [
  {path: '', component: IndexComponent},
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
      ingredient: RecipeResolver
    },
    canActivate: [LoggedGuard],
    data: {title: 'Recipe'},
  },
  {
    path: 'recipe',
    component: RecipeComponent,
    canActivate: [LoggedGuard],
    data: {title: 'Recipe'},
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoggedGuard, UserService]
})
export class RoutingModule {
}

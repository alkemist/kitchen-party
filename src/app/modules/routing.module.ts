import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IngredientComponent} from '../components/views/backend/ingredient/ingredient.component';
import {IngredientsComponent} from '../components/views/backend/ingredients/ingredients.component';
import {RecipeComponent} from '../components/views/backend/recipe/recipe.component';
import {RecipesComponent} from '../components/views/backend/recipes/recipes.component';
import {FrontRecipeComponent} from '../components/views/frontend/recipe/recipe.component';
import {FrontRecipesComponent} from '../components/views/frontend/recipes/recipes.component';
import {LoginComponent} from '../components/views/user/login/login.component';
import {LoggedGuard} from '../guards/logged.guard';
import {LoginGuard} from '../guards/login.guard';
import {IngredientResolver} from '../resolvers/ingredient.resolver';
import {RecipeResolver} from '../resolvers/recipe.resolver';
import {UserService} from '../services/user.service';
import {KitchenIngredientsComponent} from "../components/views/backend/kitchen-ingredients/kitchen-ingredients.component";
import {KitchenIngredientComponent} from "../components/views/backend/kitchen-ingredient/kitchen-ingredient.component";
import {KitchenResolver} from "../resolvers/kitchen.resolver";

const routes: Routes = [
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard], data: {title: 'Login', showFilter: false}},
  {path: 'logged', redirectTo: '/ingredients', pathMatch: 'full'},
  {
    path: 'ingredients',
    component: IngredientsComponent,
    canActivate: [LoggedGuard],
    data: {title: 'Ingredients', showFilter: false}
  },
  {
    path: 'ingredient/:slug',
    component: IngredientComponent,
    resolve: {
      ingredient: IngredientResolver
    },
    data: {title: 'Ingredient', showFilter: false},
  },
  {
    path: 'ingredient',
    component: IngredientComponent,
    data: {title: 'Ingredient', showFilter: false},
  },
  {
    path: 'recipes',
    component: RecipesComponent,
    canActivate: [LoggedGuard],
    data: {title: 'Recipes', showFilter: false}
  },
  {
    path: 'recipe/:slug',
    component: RecipeComponent,
    resolve: {
      recipe: RecipeResolver
    },
    canActivate: [LoggedGuard],
    data: {title: 'Recipe', showFilter: false},
  },
  {
    path: 'recipe',
    component: RecipeComponent,
    canActivate: [LoggedGuard],
    data: {title: 'Recipe', showFilter: false},
  },
  {
    path: 'kitchen-ingredients',
    component: KitchenIngredientsComponent,
    canActivate: [LoggedGuard],
    data: {title: 'Kitchen ingredients', showFilter: false}
  },
  {
    path: 'kitchen-ingredient/:slug',
    component: KitchenIngredientComponent,
    resolve: {
      recipe: KitchenResolver
    },
    canActivate: [LoggedGuard],
    data: {title: 'Kitchen ingredient', showFilter: false},
  },
  {
    path: 'kitchen-ingredient',
    component: KitchenIngredientComponent,
    canActivate: [LoggedGuard],
    data: {title: 'Kitchen ingredient', showFilter: false},
  },
  {
    path: ':slug', component: FrontRecipeComponent,
    resolve: {
      recipe: RecipeResolver
    },
    data: {showFilter: false, hideHeader: true}
  },
  {path: '', component: FrontRecipesComponent, data: {showFilter: true}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoggedGuard, UserService]
})
export class RoutingModule {
}

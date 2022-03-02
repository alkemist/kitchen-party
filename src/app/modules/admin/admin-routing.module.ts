import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngredientsComponent } from '../../components/views/backend/ingredients/ingredients.component';
import { LoggedGuard } from '../../guards/logged.guard';
import { IngredientComponent } from '../../components/views/backend/ingredient/ingredient.component';
import { IngredientResolver } from '../../resolvers/ingredient.resolver';
import { RecipesComponent } from '../../components/views/backend/recipes/recipes.component';
import { RecipeComponent } from '../../components/views/backend/recipe/recipe.component';
import { RecipeResolver } from '../../resolvers/recipe.resolver';
import {
  KitchenIngredientsComponent
} from '../../components/views/backend/kitchen-ingredients/kitchen-ingredients.component';
import {
  KitchenIngredientComponent
} from '../../components/views/backend/kitchen-ingredient/kitchen-ingredient.component';
import { KitchenResolver } from '../../resolvers/kitchen.resolver';

const routes: Routes = [
  { path: '', redirectTo: '/admin/recipes', pathMatch: 'full' },
  {
    path: 'ingredients',
    component: IngredientsComponent,
    canActivate: [ LoggedGuard ],
    data: { title: 'Ingredients' }
  },
  {
    path: 'ingredient/:slug',
    component: IngredientComponent,
    resolve: {
      ingredient: IngredientResolver
    },
    data: { title: 'Ingredient' },
  },
  {
    path: 'ingredient',
    component: IngredientComponent,
    data: { title: 'Ingredient' },
  },
  {
    path: 'recipes',
    component: RecipesComponent,
    canActivate: [ LoggedGuard ],
    data: { title: 'Recipes' }
  },
  {
    path: 'recipe/:slug',
    component: RecipeComponent,
    resolve: {
      recipe: RecipeResolver
    },
    canActivate: [ LoggedGuard ],
    data: { title: 'Recipe' },
  },
  {
    path: 'recipe',
    component: RecipeComponent,
    canActivate: [ LoggedGuard ],
    data: { title: 'Recipe' },
  },
  {
    path: 'kitchen-ingredients',
    component: KitchenIngredientsComponent,
    canActivate: [ LoggedGuard ],
    data: { title: 'Kitchen ingredients' }
  },
  {
    path: 'kitchen-ingredient/:slug',
    component: KitchenIngredientComponent,
    resolve: {
      kitchenIngredient: KitchenResolver
    },
    canActivate: [ LoggedGuard ],
    data: { title: 'Kitchen ingredient' },
  },
  {
    path: 'kitchen-ingredient',
    component: KitchenIngredientComponent,
    canActivate: [ LoggedGuard ],
    data: { title: 'Kitchen ingredient' },
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class AdminRoutingModule {
}

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
import { ingredientResolver, KitchenResolver, RecipeResolver, recipeResolver } from '@resolvers';

const routes: Routes = [
  { path: '', redirectTo: '/admin/recipes', pathMatch: 'full' },
  {
    path: 'ingredients',
    component: IngredientsComponent,
    data: { title: 'Ingredients' }
  },
  {
    path: 'ingredient/:slug',
    component: IngredientComponent,
    resolve: {
      ingredient: ingredientResolver
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
    data: { title: 'Recipes' }
  },
  {
    path: 'recipe/:slug',
    component: RecipeComponent,
    resolve: {
      recipe: RecipeResolver,
      _recipe: recipeResolver
    },
    data: { title: 'Recipe' },
  },
  {
    path: 'recipe',
    component: RecipeComponent,
    data: { title: 'Recipe' },
  },
  {
    path: 'kitchen-ingredients',
    component: KitchenIngredientsComponent,
    data: { title: 'Kitchen ingredients' }
  },
  {
    path: 'kitchen-ingredient/:slug',
    component: KitchenIngredientComponent,
    resolve: {
      kitchenIngredient: KitchenResolver
    },
    data: { title: 'Kitchen ingredient' },
  },
  {
    path: 'kitchen-ingredient',
    component: KitchenIngredientComponent,
    data: { title: 'Kitchen ingredient' },
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class AdminRoutingModule {
}

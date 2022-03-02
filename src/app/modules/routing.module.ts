import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from '../components/views/frontend/about/about.component';
import { CalendarComponent } from '../components/views/frontend/calendar/calendar.component';
import { ShoppingComponent } from '../components/views/frontend/shopping/shopping.component';
import { RecipesResolver } from '../resolvers/recipes.resolver';
import { FrontRecipeComponent } from '../components/views/frontend/recipe/front-recipe.component';
import { RecipeResolver } from '../resolvers/recipe.resolver';
import { DietResolver } from '../resolvers/diet.resolver';
import { FrontRecipesComponent } from '../components/views/frontend/recipes/front-recipes.component';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(mod => mod.AdminModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module')
      .then(mod => mod.UserModule)
  },
  { path: 'about', component: AboutComponent, data: { title: 'About', showAppName: true } },
  { path: 'calendar', component: CalendarComponent, data: { title: 'Calendar', showAppName: true } },
  { path: 'logged', redirectTo: '/admin', pathMatch: 'full' },
  {
    path: 'shopping/:slugs', component: ShoppingComponent,
    resolve: {
      recipes: RecipesResolver
    },
    data: { title: 'Shopping list', showAppName: true }
  },
  {
    path: ':slug', component: FrontRecipeComponent,
    resolve: {
      recipe: RecipeResolver
    },
    data: { title: 'Recipe', hideHeader: true, enableNoSleep: true }
  },
  {
    path: ':slug/:diet', component: FrontRecipeComponent,
    resolve: {
      recipe: RecipeResolver,
      diet: DietResolver,
    },
    data: { title: 'Recipe', hideHeader: true, enableNoSleep: true }
  },
  { path: '', component: FrontRecipesComponent, data: { showFilters: true } },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
})
export class RoutingModule {
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AboutComponent,
  CalendarComponent,
  FrontRecipeComponent,
  FrontRecipesComponent,
  ShoppingComponent
} from '@components';
import { DietResolver, RecipeResolver, RecipesResolver } from '@resolvers';

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

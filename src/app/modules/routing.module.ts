import {Injectable, NgModule} from '@angular/core';
import {RouterModule, RouterStateSnapshot, Routes, TitleStrategy} from '@angular/router';
import {
  AboutComponent,
  CalendarComponent,
  FrontRecipeComponent,
  FrontRecipesComponent,
  ShoppingComponent
} from '@components';
import {DietResolver, RecipeResolver, RecipesResolver} from '@resolvers';
import {LoggedGuard} from "@guards";
import {Title} from '@angular/platform-browser';
import {TranslatorService} from "@services";

@Injectable()
export class CustomTitleStrategy extends TitleStrategy {
  constructor(
    private readonly title: Title,
    private readonly translatorService: TranslatorService,
  ) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    let title = this.buildTitle(routerState);
    let routeData = routerState.root.firstChild?.data as Record<string, any>;

    // Submodule route data
    if (Object.keys(routeData).length === 0) {
      routeData = routerState.root.children[0].children[0].data;
    }

    if (routeData['recipe']) {
      title = routeData['recipe'].name;
    } else if (routeData['title'] !== undefined) {
      title = this.translatorService.translate(routeData['title']);
    }

    if (title !== undefined) {
      this.title.setTitle(`${title} | Kitchen Party`);
    } else {
      this.title.setTitle(`Kitchen Party`);
    }
  }
}

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [LoggedGuard],
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: TitleStrategy,
      useClass: CustomTitleStrategy
    }
  ]
})
export class RoutingModule {
}

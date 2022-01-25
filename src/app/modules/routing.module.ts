import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IndexComponent} from '../components/views/kitchen/index/index.component';
import {IngredientComponent} from '../components/views/kitchen/ingredient/ingredient.component';
import {IngredientsComponent} from '../components/views/kitchen/ingredients/ingredients.component';
import {LoginComponent} from '../components/views/user/login/login.component';
import {LoggedGuard} from '../guards/logged.guard';
import {IngredientResolver} from '../resolvers/ingredient.resolver';
import {UserService} from '../services/user.service';

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'login', component: LoginComponent},
  {path: 'ingredients', component: IngredientsComponent, canActivate: [LoggedGuard]},
  {
    path: 'ingredient/:slug',
    component: IngredientComponent,
    resolve: {
      ingredient: IngredientResolver
    }
  },
  {
    path: 'ingredient',
    component: IngredientComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [LoggedGuard, UserService]
})
export class RoutingModule {
}

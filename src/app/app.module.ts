import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {NgxsModule} from '@ngxs/store';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import './app.database';
import {HeaderComponent} from './components/layouts/header/header.component';
import {IndexComponent} from './components/views/kitchen/index/index.component';
import {IngredientsComponent} from './components/views/kitchen/ingredients/ingredients.component';
import {LoginComponent} from './components/views/user/login/login.component';
import {PrimevueModule} from './primevue.module';
import {IngredientService} from './services/ingredient.service';
import {RecipeService} from './services/recipe.service';
import {UserService} from './services/user.service';
import {UserState} from './store/user.state';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    IngredientsComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot([UserState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    PrimevueModule,
    ReactiveFormsModule
  ],
  providers: [UserService, IngredientService, RecipeService],
  bootstrap: [AppComponent],
})
export class AppModule {
}

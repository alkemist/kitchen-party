import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RippleModule} from 'primeng/ripple';
import {AppComponent} from './app.component';
import {HeaderComponent} from './components/layouts/header/header.component';
import {IndexComponent} from './components/views/kitchen/index/index.component';
import {IngredientComponent} from './components/views/kitchen/ingredient/ingredient.component';
import {IngredientsComponent} from './components/views/kitchen/ingredients/ingredients.component';
import {LoginComponent} from './components/views/user/login/login.component';
import './modules/app.database';

import {RoutingModule} from './modules/routing.module';
import {StoringModule} from './modules/storing.module';
import {TranslatingModule} from './modules/translating.module';
import {UiModule} from './modules/ui.module';
import {IngredientService} from './services/ingredient.service';
import {RecipeService} from './services/recipe.service';
import {UserService} from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    IngredientsComponent,
    IndexComponent,
    IngredientComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RoutingModule,
    BrowserAnimationsModule,
    StoringModule,
    UiModule,
    ReactiveFormsModule,
    RippleModule,
    TranslatingModule,
  ],
  providers: [UserService, IngredientService, RecipeService],
  bootstrap: [AppComponent],
})
export class AppModule {
}


import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RippleModule} from 'primeng/ripple';
import {AppComponent} from './app.component';
import {DialogIngredientComponent} from './components/dialogs/ingredient/ingredient.component';
import {FormIngredientComponent} from './components/forms/ingredient/ingredient.component';
import {HeaderComponent} from './components/layouts/header/header.component';
import {IngredientComponent} from './components/views/backend/ingredient/ingredient.component';
import {IngredientsComponent} from './components/views/backend/ingredients/ingredients.component';
import {RecipeComponent} from './components/views/backend/recipe/recipe.component';
import {RecipesComponent} from './components/views/backend/recipes/recipes.component';
import {FrontRecipeComponent} from './components/views/frontend/recipe/recipe.component';
import {FrontRecipesComponent} from './components/views/frontend/recipes/recipes.component';
import {LoginComponent} from './components/views/user/login/login.component';
import './modules/app.database';

import {RoutingModule} from './modules/routing.module';
import {ServicesModule} from './modules/services.module';
import {StoringModule} from './modules/storing.module';
import {TranslatingModule} from './modules/translating.module';
import {UiModule} from './modules/ui.module';
import {FormKitchenIngredientComponent,} from './components/forms/kitchen-ingredient/kitchen-ingredient.component';
import {KitchenIngredientsComponent} from './components/views/backend/kitchen-ingredients/kitchen-ingredients.component';
import {KitchenIngredientComponent} from "./components/views/backend/kitchen-ingredient/kitchen-ingredient.component";
import {ShoppingComponent} from './components/views/frontend/shopping/shopping.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    FrontRecipeComponent,
    FrontRecipesComponent,
    IngredientComponent,
    IngredientsComponent,
    RecipeComponent,
    RecipesComponent,
    FormIngredientComponent,
    DialogIngredientComponent,
    KitchenIngredientComponent,
    KitchenIngredientsComponent,
    FormKitchenIngredientComponent,
    ShoppingComponent
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
    ServicesModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}


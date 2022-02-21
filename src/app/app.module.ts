import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RippleModule } from 'primeng/ripple';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { DialogIngredientComponent } from './components/dialogs/ingredient/ingredient.component';
import { FormIngredientComponent } from './components/forms/ingredient/ingredient.component';
import { FormKitchenIngredientComponent, } from './components/forms/kitchen-ingredient/kitchen-ingredient.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { IngredientComponent } from './components/views/backend/ingredient/ingredient.component';
import { IngredientsComponent } from './components/views/backend/ingredients/ingredients.component';
import { KitchenIngredientComponent } from './components/views/backend/kitchen-ingredient/kitchen-ingredient.component';
import { KitchenIngredientsComponent } from './components/views/backend/kitchen-ingredients/kitchen-ingredients.component';
import { RecipeComponent } from './components/views/backend/recipe/recipe.component';
import { RecipesComponent } from './components/views/backend/recipes/recipes.component';
import { AboutComponent } from './components/views/frontend/about/about.component';
import { CalendarComponent } from './components/views/frontend/calendar/calendar.component';
import { FrontRecipeComponent } from './components/views/frontend/recipe/recipe.component';
import { FrontRecipesComponent } from './components/views/frontend/recipes/recipes.component';
import { ShoppingComponent } from './components/views/frontend/shopping/shopping.component';
import { LoginComponent } from './components/views/user/login/login.component';
import './modules/app.database';

import { RoutingModule } from './modules/routing.module';
import { ServicesModule } from './modules/services.module';
import { StoringModule } from './modules/storing.module';
import { TranslatingModule } from './modules/translating.module';
import { UiModule } from './modules/ui.module';
import { TranslatorPipe } from './pipes/translator.pipe';

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
    ShoppingComponent,
    AboutComponent,
    TranslatorPipe,
    CalendarComponent,
  ],
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
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
  bootstrap: [ AppComponent ],
})
export class AppModule {
}


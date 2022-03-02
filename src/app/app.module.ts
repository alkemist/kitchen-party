import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { AboutComponent } from './components/views/frontend/about/about.component';
import { CalendarComponent } from './components/views/frontend/calendar/calendar.component';
import { FrontRecipeComponent } from './components/views/frontend/recipe/front-recipe.component';
import { FrontRecipesComponent } from './components/views/frontend/recipes/front-recipes.component';
import { ShoppingComponent } from './components/views/frontend/shopping/shopping.component';
import './app.database';
import { ServicesModule } from './modules/services.module';
import { StoringModule } from './modules/storing.module';
import { TranslatorPipe } from './pipes/translator.pipe';
import { RoutingModule } from './modules/routing.module';
import { SharingModule } from './modules/sharing.module';
import { TranslatingRootModule } from './modules/translating.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FrontRecipeComponent,
    FrontRecipesComponent,
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
    RoutingModule,
    BrowserAnimationsModule,
    StoringModule,
    ServicesModule,
    StoringModule,
    SharingModule,
    TranslatingRootModule,
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {
}


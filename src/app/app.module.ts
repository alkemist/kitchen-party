import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import './app.database';
import {
  AboutComponent,
  CalendarComponent,
  FrontRecipeComponent,
  FrontRecipesComponent,
  HeaderComponent,
  ShoppingComponent
} from './components';
import { RoutingModule, ServicesModule, SharingModule, StoringModule, TranslatingRootModule } from './modules';
import { TranslatorPipe } from './pipes';

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


import { DataStoreModule } from '@alkemist/ngx-data-store';
import { importProvidersFrom, NgModule } from '@angular/core';
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
import { RoutingModule } from './modules/routing.module';
import { ServicesModule } from './modules/services.module';
import { SharingModule } from './modules/sharing.module';
import { StoringModule } from './modules/storing.module';
import { TranslatingRootModule } from './modules/translating.module';
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
  providers: [
    importProvidersFrom(DataStoreModule.forRoot({
      api_datastore_base_url: environment['DATASTORE_BASE_URL'],
      api_project_key: 'kitchen-party',
      front_callback_path: 'user/authorize/google',
      front_logged_path: '/',
      front_login_path: '/login',
      local_storage_auth_key: 'token',
      store_default_max_hour_outdated: 24,
      offline_mode: false
    })),
  ],
  bootstrap: [ AppComponent ],
})
export class AppModule {
}


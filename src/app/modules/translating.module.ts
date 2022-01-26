import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppMissingTranslationHandler} from '../handlers/missing-translation.handler';

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: AppMissingTranslationHandler
      },
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient): TranslateHttpLoader => {
          return new TranslateHttpLoader(http);
        },
        deps: [HttpClient]
      },
      isolate: true,
    })
  ],
  exports: [
    TranslateModule
  ],
})
export class TranslatingModule {
}

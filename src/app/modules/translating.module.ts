import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppMissingTranslationHandler } from '@handlers';
import { MissingTranslationHandler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoggerService } from '@services';

const TranslateConfig = {
  missingTranslationHandler: {
    provide: MissingTranslationHandler,
    useClass: AppMissingTranslationHandler,
    deps: [ LoggerService ]
  },
  loader: {
    provide: TranslateLoader,
    useFactory: (http: HttpClient): TranslateHttpLoader => {
      return new TranslateHttpLoader(http);
    },
    deps: [ HttpClient ],
    isolate: true,
  },
};

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forRoot(TranslateConfig)
  ],
  exports: [
    TranslateModule
  ],
})
export class TranslatingRootModule {
}

@NgModule({
  imports: [
    HttpClientModule,
    TranslateModule.forChild(TranslateConfig)
  ],
  exports: [
    TranslateModule
  ],
})

export class TranslatingChildModule {
}

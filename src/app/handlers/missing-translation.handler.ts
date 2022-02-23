import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { TranslationError } from '../errors';
import { LoggerService } from '../services';

export class AppMissingTranslationHandler implements MissingTranslationHandler {
  constructor(private logger: LoggerService) {
  }

  handle(params: MissingTranslationHandlerParams) {
    this.logger.error(new TranslationError(params.key));
    return params.key;
  }
}

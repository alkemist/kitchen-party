import { LoggedError } from '../logged.error';

export class TranslationError extends LoggedError<string> {
  override type = 'Translation';
  override message = 'Missing translation';

  constructor(public override context: string) {
    super();
  }
}

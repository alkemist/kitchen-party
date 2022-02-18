import { LoggedError } from '../logged.error';

export class WrongApiKeyError extends LoggedError<void> {
  override message = 'Wrong Api Key';
}
import {LoggedError} from "../logged.error";

export class TooManyRequestError extends LoggedError<any> {
  override type = 'Database';
  override message = 'Too many request';
}
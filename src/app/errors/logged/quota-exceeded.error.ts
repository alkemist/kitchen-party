import {LoggedError} from "../logged.error";

export class QuotaExceededError extends LoggedError<any> {
  override type = 'Database';
  override message = 'Quota exceeded';
}
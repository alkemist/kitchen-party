import {Injectable} from '@angular/core';
import {LoggedError} from "../errors/logged.error";

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() {
  }

  error<T>(error: LoggedError<T>) {
    console.error(`-- Error [${error.type}]`, error.message, error.context);
  }
}

import {Injectable} from '@angular/core';

export class LoggedError<T> extends Error {
  type: string = 'Unknown';
  context?: T;

  constructor() {
    super();
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() {
  }

  error(error: LoggedError<any>) {
    console.error(`-- Error [${error.type}]`, error.message, error.context);
  }
}

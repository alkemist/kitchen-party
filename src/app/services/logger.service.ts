import {Injectable} from '@angular/core';
import {LoggedError} from "../errors/logged.error";
import {environment} from "../../environments/environment";
import StackdriverErrorReporter from "stackdriver-errors-js"

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  errorHandler: StackdriverErrorReporter;

  constructor() {
    this.errorHandler = new StackdriverErrorReporter();
    this.errorHandler.start({
      key: environment.GOOGLE_CLOUD_OPERATIONS_API_KEY,
      projectId: environment.FIREBASE_PROJECT_ID
    });
  }

  error<T>(error: LoggedError<T>) {
    if (environment.production) {
      this.errorHandler.report(error);
    } else {
      console.error(`-- Error [${error.type}]`, error.message, error.context);
    }
  }
}

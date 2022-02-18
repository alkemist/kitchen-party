import {LoggedError} from "../logged.error";

export class NotFoundUploadError extends LoggedError<string> {
  override type = 'Upload';
  override message = 'File not found';

  constructor(public override context: string) {
    super();
  }
}
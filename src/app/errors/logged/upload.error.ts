import { LoggedError } from '../logged.error';

export class UploadError extends LoggedError<File> {
  override type = 'Upload';
  override message = 'Upload error';

  constructor(public override context: File) {
    super();
  }
}

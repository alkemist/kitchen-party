import { LoggedError } from '@errors';
import { DataObjectInterface } from '@interfaces';

export class DatabaseError extends LoggedError<DataObjectInterface> {
  override type = 'Database';

  constructor(public override message: string, public override context: DataObjectInterface) {
    super();
  }
}

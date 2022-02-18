import {LoggedError} from "../logged.error";
import {DataObjectInterface} from "../../interfaces/data-object.interface";

export class DatabaseError extends LoggedError<DataObjectInterface> {
  override type = 'Database';

  constructor(public override message: string, public override context: DataObjectInterface) {
    super();
  }
}
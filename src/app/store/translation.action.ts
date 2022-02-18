import {KeyValueInterface} from "../interfaces/key-value.interface";

export class FillTranslations {
  static readonly type = '[Translations] Fill';

  constructor(public payload: KeyValueInterface[]) {
  }
}

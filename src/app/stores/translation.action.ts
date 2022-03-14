import { KeyValueInterface } from '@interfaces';

export class FillTranslations {
  static readonly type = '[Translations] Fill';

  constructor(public payload: KeyValueInterface[]) {
  }
}

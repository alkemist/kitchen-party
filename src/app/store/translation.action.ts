import {Translation} from "./translation.state";


export class FillTranslations {
  static readonly type = '[Translations] Fill';

  constructor(public payload: Translation[]) {
  }
}

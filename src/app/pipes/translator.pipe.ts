import {Pipe, PipeTransform} from '@angular/core';
import {TranslatorService} from "../services/translator.service";

@Pipe({
  name: 'translator'
})
export class TranslatorPipe implements PipeTransform {
  constructor(public translatorService: TranslatorService) {

  }

  transform(key: string, ...args: unknown[]): unknown {
    return this.translatorService.instant(key);
  }

}
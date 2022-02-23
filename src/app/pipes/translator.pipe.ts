import { Pipe, PipeTransform } from '@angular/core';
import { TranslatorService } from '../services';

@Pipe({
  name: 'translator'
})
export class TranslatorPipe implements PipeTransform {
  constructor(public translatorService: TranslatorService) {

  }

  transform(key: string, ...args: unknown[]): string {
    return this.translatorService.translate(key);
  }

}

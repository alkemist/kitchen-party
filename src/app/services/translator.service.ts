import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { first, Observable } from 'rxjs';
import { TranslationError } from '../errors';
import { KeyLabelInterface, KeyValueInterface } from '../interfaces';
import { FillTranslations } from '../stores/translation.action';
import { TranslationState } from '../stores/translation.state';
import { ArrayHelper, TimeHelper } from '../tools';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {
  @Select(TranslationState.lastUpdated) lastUpdated$?: Observable<Date>;
  @Select(TranslationState.all) protected all$?: Observable<KeyValueInterface[]>;
  protected lastUpdated?: Date;
  private all: KeyValueInterface[] = [];
  private lang = 'fr';
  private promise: Promise<void> | undefined;

  constructor(private translateService: TranslateService, private store: Store, private logger: LoggerService) {
    this.lastUpdated$?.subscribe(async lastUpdated => {
      this.lastUpdated = lastUpdated;
      if (this.storeIsOutdated()) {
        await this.refresh();
      }
    });

    this.all$?.pipe(first()).subscribe(translations => {
      this.all = translations;
    });
  }

  storeIsOutdated() {
    if (this.lastUpdated === undefined) {
      return true;
    }
    const nbHours = TimeHelper.calcHoursAfter(this.lastUpdated);
    return nbHours > 24;
  }

  async instant(key: string): Promise<string> {
    if (this.all.length === 0) {
      await this.refresh();
    }
    return this.translate(key);
  }

  translate(key: string): string {
    const value = this.all.find(translation => translation.key === key)?.value || '';
    if (!value) {
      this.logger.error(new TranslationError(key));
      return key;
    }
    return value;
  }

  async translateLabels(keyObjects: KeyLabelInterface[]): Promise<KeyLabelInterface[]> {
    return Promise.all(keyObjects.map(async item => {
      return {...item, label: await this.instant(item.label)};
    }));
  }

  async translateMap<T extends string, U extends string>(map: Map<T, U>): Promise<Map<T, string>> {
    const translations = await Promise.all(Array.from(map).map(([ value ]) => this.instant(value)));
    return ArrayHelper.keysValuesToMap<T, string>(Array.from(map.keys()), translations);
  }

  async refresh(): Promise<void> {
    if (this.promise) {
      return this.promise;
    }

    this.promise = new Promise<void>(resolve => {
      this.translateService.getTranslation(this.lang).pipe(first()).subscribe(translations => {
        const keys: string[] = Object.keys(translations);
        const values: string[] = Object.values(translations);
        this.all = keys.map((value, index) => {
          const keyValue: KeyValueInterface = {key: value, value: values[index]};
          return keyValue;
        });

        this.store.dispatch(new FillTranslations(this.all));
        this.promise = undefined;
        resolve();
      });
    });
    return this.promise;
  }
}

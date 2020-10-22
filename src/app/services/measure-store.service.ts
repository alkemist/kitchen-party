import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MeasureInterface} from '../interfaces/measure';
import {MeasureApiService} from './measure-api.service';
import {GenericStoreService} from '../generics/generic-store.service';
import {ActionInterface} from '../interfaces/action';
import {FamilyInterface} from '../interfaces/family';
import {FamilyStoreService} from './family-store.service';

@Injectable({
  providedIn: 'root'
})
export class MeasureStoreService extends GenericStoreService<MeasureInterface>{
  entityName = 'measure';
  constructor(private measureService: MeasureApiService, private familyStore: FamilyStoreService) {
    super(measureService);
  }

  protected hydrate(measure: MeasureInterface): Promise<MeasureInterface> {
    return new Promise<MeasureInterface>((resolve) => {
      const promises: Promise<MeasureInterface>[] = [];

      if (measure.measureId && !measure.measure) {
        promises.push(new Promise<MeasureInterface>((resolveMeasure) => {
          this.find(measure.measureId).then(parent => {
            measure.measure = parent;
            resolveMeasure(measure);
          });
        }));
      }

      if (measure.familyId && !measure.family) {
        promises.push(new Promise<MeasureInterface>((resolveFamily) => {
          this.familyStore.find(measure.familyId).then(family => {
            measure.family = family;
            resolveFamily(measure);
          });
        }));
      }

      if (promises.length > 0) {
        return Promise.all(promises).then(families => {
          const measureHydrated = Object.assign({}, ...families);
          console.log('[STORE]', 'measure', 'hydrated', measureHydrated);
          this.setEntity(measureHydrated);
          resolve(measureHydrated);
        });
      } else {
        this.setEntity(measure);
        resolve(measure);
      }
    });
  }
}

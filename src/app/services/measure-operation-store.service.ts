import { Injectable } from '@angular/core';
import {GenericStoreService} from '../generics/generic-store.service';
import {MeasureOperationInterface} from '../interfaces/operation';
import {MeasureOperationApiService} from './measure-operation-api.service';
import {OperationStoreService} from './operation-store.service';
import {MeasureStoreService} from './measure-store.service';

@Injectable({
  providedIn: 'root'
})
export class MeasureOperationStoreService extends GenericStoreService<MeasureOperationInterface>{
  entityName = 'measure_operation';
  constructor(private measureOperationService: MeasureOperationApiService,
              private measureStore: MeasureStoreService
  ) {
    super(measureOperationService);
  }

  protected hydrate(measureOperation: MeasureOperationInterface): Promise<MeasureOperationInterface> {
    return new Promise<MeasureOperationInterface>((resolve) => {
      const promises: Promise<MeasureOperationInterface>[] = [];

      if (measureOperation.measureId && !measureOperation.measure) {
        promises.push(new Promise<MeasureOperationInterface>((resolveMeasure) => {
          this.measureStore.find(measureOperation.measureId).then(measure => {
            measureOperation.measure = measure;
            resolveMeasure(measureOperation);
          });
        }));
      }

      if (promises.length > 0) {
        return Promise.all(promises).then(measureOperations => {
          const measureOperationHydrated = Object.assign({}, ...measureOperations);
          this.setEntity(measureOperationHydrated);
          resolve(measureOperationHydrated);
        });
      } else {
        this.setEntity(measureOperation);
        resolve(measureOperation);
      }
    });
  }
}

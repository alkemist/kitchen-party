import { Injectable } from '@angular/core';
import {GenericApiService} from '../generics/generic-api.service';
import {MeasureIngredientInterface, MeasureOperationInterface} from '../interfaces/operation';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeasureOperationApiService extends GenericApiService<MeasureOperationInterface>{
  entityName = 'measure_operation';
  constructor(protected http: HttpClient) {
    super(http);
  }

  protected clearEntity(measureOperation: MeasureOperationInterface): MeasureOperationInterface {
    const measureOperationCleared =  Object.assign({}, measureOperation);

    if (typeof measureOperationCleared.measure === 'object') {
      measureOperationCleared.measureId = measureOperationCleared.measure.id;
      delete measureOperationCleared.measure;
    }
    if (typeof measureOperationCleared.operation === 'object') {
      measureOperationCleared.operationId = measureOperationCleared.operation.id;
      delete measureOperationCleared.operation;
    }

    return measureOperationCleared;
  }
}

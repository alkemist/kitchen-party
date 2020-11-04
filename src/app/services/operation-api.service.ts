import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OperationInterface} from '../interfaces/operation';
import {GenericApiService} from '../generics/generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class OperationApiService extends GenericApiService<OperationInterface>{
  entityName = 'operation';
  constructor(protected http: HttpClient) {
    super(http);
  }

  protected clearEntity(operation: OperationInterface): OperationInterface {
    const operationCleared =  Object.assign({}, operation);

    operationCleared.actionId = operationCleared.action.id;
    delete operationCleared.action;

    if (operation.measureIngredients.length > 0) {
      const measureIngredientIds = [];
      operation.measureIngredients.forEach(measureIngredient => {
        measureIngredientIds.push(measureIngredient.id);
      });
      operationCleared.measureIngredientIds = measureIngredientIds;
      delete operationCleared.measureIngredients;
    }

    if (operation.measureTools.length > 0) {
      const measureToolIds = [];
      operation.measureTools.forEach(measureTool => {
        measureToolIds.push(measureTool.id);
      });
      operationCleared.measureToolIds = measureToolIds;
      delete operationCleared.measureTools;
    }

    if (operation.measureOperations.length > 0) {
      const measureOperationIds = [];
      operation.measureOperations.forEach(measureOperation => {
        measureOperationIds.push(measureOperation.id);
      });
      operationCleared.measureOperationIds = measureOperationIds;
      delete operationCleared.measureOperations;
    }

    return operationCleared;
  }
}

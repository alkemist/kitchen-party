import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {OperationInterface} from '../interfaces/operation';
import {GenericStoreService} from '../generics/generic-store.service';
import {MeasureInterface} from '../interfaces/measure';
import {IngredientInterface} from '../interfaces/ingredient';
import {MeasureIngredientStoreService} from './measure-ingredient-store.service';
import {MeasureToolStoreService} from './measure-tool-store.service';
import {MeasureOperationStoreService} from './measure-operation-store.service';
import {OperationApiService} from './operation-api.service';
import {ActionStoreService} from './action-store.service';

@Injectable({
  providedIn: 'root'
})
export class OperationStoreService extends GenericStoreService<OperationInterface> {
  entityName = 'operation';
  constructor(
    private operationService: OperationApiService,
    private actionStore: ActionStoreService,
    private measureIngredientStore: MeasureIngredientStoreService,
    private measureToolStore: MeasureToolStoreService,
    private measureOperationStore: MeasureOperationStoreService,
  ) {
    super(operationService);
  }

  protected hydrate(operation: OperationInterface): Promise<OperationInterface> {
    return new Promise<OperationInterface>((resolve) => {
      const promises: Promise<OperationInterface>[] = [];

      if (operation.actionId && !operation.action) {
        promises.push(new Promise<OperationInterface>((resolveAction) => {
          this.actionStore.find(operation.actionId).then(action => {
            operation.action = action;
            resolveAction(operation);
          });
        }));
      }

      if (typeof operation.measureIngredientIds !== 'undefined') {
        operation.measureIngredients = [];
        operation.measureIngredientIds.forEach(measureIngredientId => {
          promises.push(new Promise<OperationInterface>((resolveMeasureIngredient) => {
            this.measureIngredientStore.find(measureIngredientId).then(measureIngredient => {
              operation.measureIngredients.push(measureIngredient);
              resolveMeasureIngredient(operation);
            });
          }));
        });
      }

      if (typeof operation.measureToolIds !== 'undefined') {
        operation.measureTools = [];
        operation.measureToolIds.forEach(measureToolId => {
          promises.push(new Promise<OperationInterface>((resolveMeasureTool) => {
            this.measureToolStore.find(measureToolId).then(measureTool => {
              operation.measureTools.push(measureTool);
              resolveMeasureTool(operation);
            });
          }));
        });
      }

      if (typeof operation.measureOperationIds !== 'undefined') {
        operation.measureOperations = [];
        operation.measureOperationIds.forEach(measureOperationId => {
          promises.push(new Promise<OperationInterface>((resolveMeasureOperation) => {
            this.measureOperationStore.find(measureOperationId).then(measureOperation => {
              operation.measureOperations.push(measureOperation);
              resolveMeasureOperation(operation);
            });
          }));
        });
      }

      if (promises.length > 0) {
        return Promise.all(promises).then(operations => {
          const operationHydrated = Object.assign({}, ...operations);
          this.setEntity(operationHydrated);
          resolve(operationHydrated);
        });
      } else {
        this.setEntity(operation);
        resolve(operation);
      }
    });
  }
}

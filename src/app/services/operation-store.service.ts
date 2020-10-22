import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {OperationInterface} from '../interfaces/operation';
import {OperationApiService} from './operation-api.service';
import {GenericStoreService} from '../generics/generic-store.service';
import {MeasureInterface} from '../interfaces/measure';

@Injectable({
  providedIn: 'root'
})
export class OperationStoreService extends GenericStoreService<OperationInterface> {
  entityName = 'operation';
  constructor(private operationService: OperationApiService) {
    super(operationService);
  }
}

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
}

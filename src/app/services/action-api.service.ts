import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActionInterface} from '../interfaces/action';
import {GenericApiService} from '../generics/generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class ActionApiService extends GenericApiService<ActionInterface>{
  entityName = 'action';
  constructor(protected http: HttpClient) {
    super(http);
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MeasureInterface} from '../interfaces/measure';
import {GenericApiService} from '../generics/generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class MeasureApiService extends GenericApiService<MeasureInterface>{
  entityName = 'measure';
  constructor(protected http: HttpClient) {
    super(http);
  }
}

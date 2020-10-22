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

  protected clearEntity(measure: MeasureInterface): MeasureInterface {
    const measureCleared =  Object.assign({}, measure);

    if (typeof measureCleared.family === 'object') {
      measureCleared.familyId = measureCleared.family.id;
      delete measureCleared.family;
    }
    if (typeof measureCleared.measure === 'object') {
      measureCleared.measureId = measureCleared.measure.id;
      delete measureCleared.measure;
    }

    return measureCleared;
  }
}

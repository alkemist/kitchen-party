import { Injectable } from '@angular/core';
import {GenericApiService} from '../generics/generic-api.service';
import {MeasureIngredientInterface, MeasureToolInterface} from '../interfaces/operation';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeasureToolApiService extends GenericApiService<MeasureToolInterface>{
  entityName = 'measure_tool';
  constructor(protected http: HttpClient) {
    super(http);
  }

  protected clearEntity(measureTool: MeasureToolInterface): MeasureToolInterface {
    const measureToolCleared =  Object.assign({}, measureTool);

    if (typeof measureToolCleared.measure === 'object') {
      measureToolCleared.measureId = measureToolCleared.measure.id;
      delete measureToolCleared.measure;
    }
    if (typeof measureToolCleared.tool === 'object') {
      measureToolCleared.toolId = measureToolCleared.tool.id;
      delete measureToolCleared.tool;
    }

    return measureToolCleared;
  }
}

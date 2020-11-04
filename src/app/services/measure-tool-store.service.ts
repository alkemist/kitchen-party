import { Injectable } from '@angular/core';
import {GenericStoreService} from '../generics/generic-store.service';
import {MeasureToolInterface} from '../interfaces/operation';
import {MeasureToolApiService} from './measure-tool-api.service';
import {ToolStoreService} from './tool-store.service';
import {MeasureStoreService} from './measure-store.service';

@Injectable({
  providedIn: 'root'
})
export class MeasureToolStoreService extends GenericStoreService<MeasureToolInterface>{
  entityName = 'measure_tool';
  constructor(private measureToolService: MeasureToolApiService,
              private measureStore: MeasureStoreService,
              private toolStore: ToolStoreService
  ) {
    super(measureToolService);
  }

  protected hydrate(measureTool: MeasureToolInterface): Promise<MeasureToolInterface> {
    return new Promise<MeasureToolInterface>((resolve) => {
      const promises: Promise<MeasureToolInterface>[] = [];

      if (measureTool.measureId && !measureTool.measure) {
        promises.push(new Promise<MeasureToolInterface>((resolveMeasure) => {
          this.measureStore.find(measureTool.measureId).then(measure => {
            measureTool.measure = measure;
            resolveMeasure(measureTool);
          });
        }));
      }

      if (measureTool.toolId && !measureTool.tool) {
        promises.push(new Promise<MeasureToolInterface>((resolveTool) => {
          this.toolStore.find(measureTool.toolId).then(tool => {
            measureTool.tool = tool;
            resolveTool(measureTool);
          });
        }));
      }

      if (promises.length > 0) {
        return Promise.all(promises).then(measureTools => {
          const measureToolHydrated = Object.assign({}, ...measureTools);
          this.setEntity(measureToolHydrated);
          resolve(measureToolHydrated);
        });
      } else {
        this.setEntity(measureTool);
        resolve(measureTool);
      }
    });
  }
}

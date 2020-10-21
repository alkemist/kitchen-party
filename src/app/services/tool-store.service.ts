import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ToolInterface} from '../interfaces/tool';
import {ToolApiService} from './tool-api.service';
import {GenericStoreService} from '../generics/generic-store.service';
import {MeasureInterface} from '../interfaces/measure';

@Injectable({
  providedIn: 'root'
})
export class ToolStoreService extends GenericStoreService<ToolInterface> {
  constructor(private toolService: ToolApiService) {
    super(toolService);
  }
}

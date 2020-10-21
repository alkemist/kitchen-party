import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MeasureInterface} from '../interfaces/measure';
import {MeasureApiService} from './measure-api.service';
import {GenericStoreService} from '../generics/generic-store.service';
import {ActionInterface} from '../interfaces/action';

@Injectable({
  providedIn: 'root'
})
export class MeasureStoreService extends GenericStoreService<MeasureInterface>{
  constructor(private measureService: MeasureApiService) {
    super(measureService);
  }
}

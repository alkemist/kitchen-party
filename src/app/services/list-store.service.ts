import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ListInterface} from '../interfaces/list';
import {ListApiService} from './list-api.service';
import {GenericStoreService} from '../generics/generic-store.service';
import {MeasureInterface} from '../interfaces/measure';

@Injectable({
  providedIn: 'root'
})
export class ListStoreService extends GenericStoreService<ListInterface> {
  entityName = 'list';
  constructor(private listService: ListApiService) {
    super(listService);
  }
}

import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ShelfInterface} from '../interfaces/shelf';
import {ShelfApiService} from './shelf-api.service';
import {GenericStoreService} from '../generics/generic-store.service';
import {MeasureInterface} from '../interfaces/measure';

@Injectable({
  providedIn: 'root'
})
export class ShelfStoreService extends GenericStoreService<ShelfInterface> {
  entityName = 'shelf';
  constructor(private shelfService: ShelfApiService) {
    super(shelfService);
  }
}

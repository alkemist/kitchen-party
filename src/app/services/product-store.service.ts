import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {productInterface} from '../interfaces/product';
import {productApiService} from './product-api.service';
import {GenericStoreService} from '../generics/generic-store.service';
import {MeasureInterface} from '../interfaces/measure';

@Injectable({
  providedIn: 'root'
})
export class productStoreService extends GenericStoreService<productInterface> {
  entityName = 'product';
  constructor(private productService: productApiService) {
    super(productService);
  }
}

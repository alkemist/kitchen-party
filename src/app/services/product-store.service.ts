import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ProductInterface} from '../interfaces/product';
import {ProductApiService} from './product-api.service';
import {GenericStoreService} from '../generics/generic-store.service';
import {MeasureInterface} from '../interfaces/measure';

@Injectable({
  providedIn: 'root'
})
export class ProductStoreService extends GenericStoreService<ProductInterface> {
  entityName = 'product';
  constructor(private productService: ProductApiService) {
    super(productService);
  }
}

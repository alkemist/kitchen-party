import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ProductInterface} from '../interfaces/product';
import {GenericApiService} from '../generics/generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService extends GenericApiService<ProductInterface>{
  entityName = 'product';
  constructor(protected http: HttpClient) {
    super(http);
  }
}

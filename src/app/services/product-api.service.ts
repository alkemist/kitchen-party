import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {productInterface} from '../interfaces/product';
import {GenericApiService} from '../generics/generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class productApiService extends GenericApiService<productInterface>{
  entityName = 'product';
  constructor(protected http: HttpClient) {
    super(http);
  }
}

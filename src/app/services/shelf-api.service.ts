import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ShelfInterface} from '../interfaces/shelf';
import {GenericApiService} from '../generics/generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class ShelfApiService extends GenericApiService<ShelfInterface>{
  entityName = 'shelf';
  constructor(protected http: HttpClient) {
    super(http);
  }
}

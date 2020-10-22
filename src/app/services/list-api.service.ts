import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ListInterface} from '../interfaces/list';
import {GenericApiService} from '../generics/generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class ListApiService extends GenericApiService<ListInterface>{
  entityName = 'list';
  constructor(protected http: HttpClient) {
    super(http);
  }
}

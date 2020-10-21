import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToolInterface} from '../interfaces/tool';
import {GenericApiService} from '../generics/generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class ToolApiService extends GenericApiService<ToolInterface>{
  entityName = 'tool';
  constructor(protected http: HttpClient) {
    super(http);
  }
}

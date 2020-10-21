import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FamilyInterface} from '../interfaces/family';
import {GenericApiService} from '../generics/generic-api.service';

@Injectable({
  providedIn: 'root'
})
export class FamilyApiService extends GenericApiService<FamilyInterface>{
  entityName = 'family';
  constructor(protected http: HttpClient) {
    super(http);
  }
}

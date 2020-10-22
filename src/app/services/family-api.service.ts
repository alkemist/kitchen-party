import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FamilyInterface} from '../interfaces/family';
import {GenericApiService} from '../generics/generic-api.service';
import {MeasureInterface} from '../interfaces/measure';

@Injectable({
  providedIn: 'root'
})
export class FamilyApiService extends GenericApiService<FamilyInterface>{
  entityName = 'family';
  constructor(protected http: HttpClient) {
    super(http);
  }

  protected clearEntity(family: FamilyInterface): FamilyInterface {
    const familyCleared =  Object.assign({}, family);

    if (typeof familyCleared.family === 'object') {
      familyCleared.familyId = familyCleared.family.id;
      delete familyCleared.family;
    }

    return familyCleared;
  }
}

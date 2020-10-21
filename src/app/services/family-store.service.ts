import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {FamilyInterface} from '../interfaces/family';
import {FamilyApiService} from './family-api.service';
import {GenericStoreService} from '../generics/generic-store.service';
import {ActionInterface} from '../interfaces/action';

@Injectable({
  providedIn: 'root'
})
export class FamilyStoreService extends GenericStoreService<FamilyInterface> {
  constructor(private familyService: FamilyApiService) {
    super(familyService);
  }
}

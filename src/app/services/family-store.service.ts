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
  entityName = 'family';
  constructor(private familyService: FamilyApiService) {
    super(familyService);
  }

  protected hydrate(family: FamilyInterface): Promise<FamilyInterface> {
    return new Promise<FamilyInterface>((resolve) => {
      const promises: Promise<FamilyInterface>[] = [];

      if (family.familyId && !family.family) {
        promises.push(new Promise<FamilyInterface>((resolveFamily) => {
          this.find(family.familyId).then(parent => {
            family.family = parent;
            resolveFamily(family);
          });
        }));
      }

      if (promises.length > 0) {
        return Promise.all(promises).then(families => {
          const familyHydrated = Object.assign({}, ...families);
          console.log('[STORE]', 'family', 'hydrated', familyHydrated);
          this.setEntity(familyHydrated);
          resolve(familyHydrated);
        });
      } else {
        this.setEntity(family);
        resolve(family);
      }
    });
  }
}

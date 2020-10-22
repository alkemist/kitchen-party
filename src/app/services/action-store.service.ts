import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ActionInterface} from '../interfaces/action';
import {ActionApiService} from './action-api.service';
import {GenericStoreService} from '../generics/generic-store.service';
import {IngredientInterface} from '../interfaces/ingredient';

@Injectable({
  providedIn: 'root'
})
export class ActionStoreService extends GenericStoreService<ActionInterface> {
  entityName = 'action';
  constructor(private actionService: ActionApiService) {
    super(actionService);
  }
}

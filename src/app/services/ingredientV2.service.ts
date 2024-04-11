import { Injectable, WritableSignal } from '@angular/core';
import { IngredientV2Interface } from '@interfaces';
import { LoggerService } from '@services';
import {
  IngredientAddAction,
  IngredientDeleteAction,
  IngredientFillAction,
  IngredientGetAction,
  IngredientResetAction,
  IngredientUpdateAction,
  IngredientV2State
} from '@stores';
import { DataStoreStateService } from '@alkemist/ngx-data-store';
import { MessageService } from 'primeng/api';
import { Observe } from '@alkemist/ngx-state-manager';


@Injectable({
  providedIn: 'root'
})
export class IngredientV2Service extends DataStoreStateService<IngredientV2Interface> {
  @Observe(IngredientV2State, IngredientV2State.lastUpdated)
  protected _lastUpdatedPublicItems!: WritableSignal<Date | null>;
  protected _lastUpdatedUserItems: undefined;

  constructor(
    private messageService: MessageService,
    private loggerService: LoggerService,
  ) {
    super(
      'ingredient',
      IngredientFillAction,
      null,
      IngredientGetAction,
      IngredientAddAction,
      IngredientUpdateAction,
      IngredientDeleteAction,
      IngredientResetAction
    );
  }
}

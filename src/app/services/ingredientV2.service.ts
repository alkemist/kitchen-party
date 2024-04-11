import { Injectable, WritableSignal } from '@angular/core';
import { IngredientV2BackInterface, IngredientV2FrontInterface } from '@interfaces';
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
import { IngredientModel } from '@models';


@Injectable({
  providedIn: 'root'
})
export class IngredientV2Service extends DataStoreStateService<IngredientV2FrontInterface, IngredientV2BackInterface> {
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

  async exist(ingredient: IngredientModel, id?: string) {
    const data = id
      ? await this.existUpdateItem(id, ingredient.toUniqueFields())
      : await this.existAddItem(ingredient.toUniqueFields());

    if (data.response) {
      this.messageService.add({
        severity: "error",
        detail: $localize`Ingredient already exist.`
      });
    }

    return data.response;
  }

  async update(id: string, ingredient: IngredientModel) {
    await super.dispatchUpdate(id, ingredient.toStore());
    this.messageService.add({
      severity: "success",
      detail: $localize`Ingredient updated`
    });
  }

  async add(ingredient: IngredientModel) {
    await super.dispatchAdd(ingredient.toStore());
    this.messageService.add({
      severity: "success",
      detail: $localize`Ingredient added`,
    });
  }

  async delete(ingredient: IngredientModel) {
    await super.dispatchDelete(ingredient.id!);
    this.messageService.add({
      severity: "success",
      detail: $localize`Ingredient deleted`
    });
  }
}

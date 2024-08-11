import { Injectable, WritableSignal } from '@angular/core';
import { RecipeV2BackInterface, RecipeV2FrontInterface } from '@interfaces';
import {IngredientService, IngredientV2Service, LoggerService, UserService} from '@services';
import {
  RecipeAddAction,
  RecipeDeleteAction,
  RecipeFillPublicAction,
  RecipeFillUserAction,
  RecipeGetAction,
  RecipeResetAction,
  RecipeUpdateAction,
  RecipeV2State
} from '@stores';
import { DataStoreStateService } from '@alkemist/ngx-data-store';
import { MessageService } from 'primeng/api';
import { Observe } from '@alkemist/ngx-state-manager';
import { RecipeModel } from '@models';


@Injectable({
  providedIn: 'root'
})
export class RecipeV2Service extends DataStoreStateService<RecipeV2FrontInterface, RecipeV2BackInterface> {
  @Observe(RecipeV2State, RecipeV2State.lastUpdatedPublicItems)
  protected _lastUpdatedPublicItems!: WritableSignal<Date | null>;
  @Observe(RecipeV2State, RecipeV2State.lastUpdatedUserItems)
  protected _lastUpdatedUserItems!: WritableSignal<Date | null>;

  constructor(
    userService: UserService,
    private messageService: MessageService,
    private ingredientService: IngredientService,
    private ingredientV2Service: IngredientV2Service,
    private loggerService: LoggerService,
  ) {
    super(
      userService,
      'recipe',
      RecipeV2State,
      RecipeV2State.publicItems,
      RecipeV2State.userItems,
      RecipeFillPublicAction,
      RecipeFillUserAction,
      RecipeGetAction,
      RecipeAddAction,
      RecipeUpdateAction,
      RecipeDeleteAction,
      RecipeResetAction
    );
  }

  async exist(Recipe: RecipeModel, id?: string) {
    const data = id
      ? await this.existUpdateItem(id, Recipe.toUniqueFields())
      : await this.existAddItem(Recipe.toUniqueFields());

    if (data.response) {
      this.messageService.add({
        severity: "error",
        detail: $localize`Recipe already exist.`
      });
    }

    return data.response;
  }

  async update(id: string, Recipe: RecipeModel) {
    await super.dispatchUpdate(id, Recipe.toStore());
    this.messageService.add({
      severity: "success",
      detail: $localize`Recipe updated`
    });
  }

  async add(Recipe: RecipeModel) {
    await super.dispatchAdd(Recipe.toStore());
    this.messageService.add({
      severity: "success",
      detail: $localize`Recipe added`,
    });
  }

  async delete(Recipe: RecipeModel) {
    await super.dispatchDelete(Recipe.id!);
    this.messageService.add({
      severity: "success",
      detail: $localize`Recipe deleted`
    });
  }

  async convert(recipe: RecipeModel) {
    for (let i = 0; i < recipe.recipeIngredients.length; i++) {
      const recipeIngredient = recipe.recipeIngredients[i];

      if (recipeIngredient.ingredientId) {
        const oldIngredient = await this.ingredientService.getById(recipeIngredient.ingredientId);
        if (oldIngredient) {
          const newIngredient = this.ingredientV2Service.findIngredient(oldIngredient?.slug);
          if (newIngredient) {
            recipeIngredient.ingredientId = newIngredient.id;
          } else {
            console.error('Unknown ingredient new store', oldIngredient);
          }
        } else {
          console.error('Unknown ingredient old store', recipeIngredient.ingredientId);
        }

        recipe.recipeIngredients[i] = recipeIngredient;
      }
      /*if(recipeIngredient.recipeId) {
        const oldIngredient = await this.ingredientService.getById(recipeIngredient.ingredientId);
        if(oldIngredient) {
          const newIngredient = await this.ingredientV2Service.userItem(oldIngredient?.slug);
          if(newIngredient) {
            recipeIngredient.ingredientId = newIngredient.item?.id;
          }
        }
      }*/
    }
  }
}

import {NgModule} from '@angular/core';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {NgxsStoragePluginModule} from '@ngxs/storage-plugin';
import {NgxsModule} from '@ngxs/store';
import {environment} from '../../environments/environment';
import {IngredientState} from '../store/ingredient.state';
import {KitchenIngredientState} from '../store/kitchen.state';
import {RecipeState} from '../store/recipe.state';
import {UserState} from '../store/user.state';
import {TranslationState} from "../store/translation.state";

const states = [
  UserState,
  IngredientState,
  RecipeState,
  KitchenIngredientState,
  TranslationState,
];

@NgModule({
  imports: [
    NgxsModule.forRoot(states),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production,
    }),
    NgxsStoragePluginModule.forRoot()
  ],
  exports: [
    NgxsModule
  ],
})
export class StoringModule {
}

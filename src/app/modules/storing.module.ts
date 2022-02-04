import {NgModule} from '@angular/core';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {NgxsStoragePluginModule} from '@ngxs/storage-plugin';
import {NgxsModule} from '@ngxs/store';
import {IngredientState} from '../store/ingredient.state';
import {RecipeState} from '../store/recipe.state';
import {UserState} from '../store/user.state';
import {KitchenIngredientState} from "../store/kitchen.state";

const states = [
  UserState,
  IngredientState,
  RecipeState,
  KitchenIngredientState,
];

@NgModule({
  imports: [
    NgxsModule.forRoot(states),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot()
  ],
  exports: [
    NgxsModule
  ],
})
export class StoringModule {
}

import { NgModule } from '@angular/core';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { IngredientState, KitchenIngredientState, RecipeState, TranslationState, UserState } from '@stores';
import { environment } from '../../environments/environment';


const states = [
  UserState,
  IngredientState,
  RecipeState,
  KitchenIngredientState,
  TranslationState,
];

@NgModule({
  imports: [
    NgxsModule.forRoot(states, {
      developmentMode: !environment.production
    }),
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

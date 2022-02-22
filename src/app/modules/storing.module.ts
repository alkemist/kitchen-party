import { NgModule } from '@angular/core';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { environment } from '../../environments/environment';
import { IngredientState } from '../stores/ingredient.state';
import { KitchenIngredientState } from '../stores/kitchen.state';
import { RecipeState } from '../stores/recipe.state';
import { TranslationState } from '../stores/translation.state';
import { UserState } from '../stores/user.state';

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

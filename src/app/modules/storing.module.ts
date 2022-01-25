import {NgModule} from '@angular/core';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import {NgxsModule} from '@ngxs/store';
import {IngredientState} from '../store/ingredient.state';
import {UserState} from '../store/user.state';

const states = [
  UserState,
  IngredientState
];

@NgModule({
  imports: [
    NgxsModule.forRoot(states),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
  ],
  exports: [
    NgxsModule
  ],
})
export class StoringModule {
}

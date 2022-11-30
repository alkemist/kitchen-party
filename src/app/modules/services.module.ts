import { NgModule } from '@angular/core';
import { FilterService } from 'primeng/api';
import {
  IngredientService,
  KitchenIngredientService,
  LoggerService,
  RecipeService,
  SearchService,
  TranslatorService,
  UploadService,
  UserService
} from '@services';

@NgModule({
  providers: [
    UserService,
    IngredientService,
    RecipeService,
    UploadService,
    SearchService,
    FilterService,
    TranslatorService,
    KitchenIngredientService,
    LoggerService,
  ],
})
export class ServicesModule {
}

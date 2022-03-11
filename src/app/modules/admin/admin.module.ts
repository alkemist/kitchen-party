import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminRoutingModule } from '@app/modules/admin/admin-routing.module';
import { SharingModule } from '@app/modules/sharing.module';
import { TranslatingChildModule } from '@app/modules/translating.module';
import {
  DialogIngredientComponent,
  FormIngredientComponent,
  FormKitchenIngredientComponent,
  IngredientComponent,
  IngredientsComponent,
  KitchenIngredientComponent,
  KitchenIngredientsComponent,
  RecipeComponent,
  RecipesComponent
} from '@components';


@NgModule({
  declarations: [
    IngredientComponent,
    IngredientsComponent,
    RecipeComponent,
    RecipesComponent,
    FormIngredientComponent,
    DialogIngredientComponent,
    KitchenIngredientComponent,
    KitchenIngredientsComponent,
    FormKitchenIngredientComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharingModule,
    TranslatingChildModule,
  ],
})
export class AdminModule {
}

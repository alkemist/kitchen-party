import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { AdminRoutingModule, SharingModule, TranslatingChildModule } from '@modules';


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

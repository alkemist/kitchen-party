import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { IngredientComponent } from '../../components/views/backend/ingredient/ingredient.component';
import { IngredientsComponent } from '../../components/views/backend/ingredients/ingredients.component';
import { RecipeComponent } from '../../components/views/backend/recipe/recipe.component';
import { RecipesComponent } from '../../components/views/backend/recipes/recipes.component';
import { FormIngredientComponent } from '../../components/forms/ingredient/form-ingredient.component';
import { DialogIngredientComponent } from '../../components/dialogs/ingredient/dialog-ingredient.component';
import {
  KitchenIngredientComponent
} from '../../components/views/backend/kitchen-ingredient/kitchen-ingredient.component';
import {
  KitchenIngredientsComponent
} from '../../components/views/backend/kitchen-ingredients/kitchen-ingredients.component';
import {
  FormKitchenIngredientComponent
} from '../../components/forms/kitchen-ingredient/form-kitchen-ingredient.component';
import { SharingModule } from '../sharing.module';
import { CommonModule } from '@angular/common';
import { TranslatingChildModule } from '../translating.module';


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

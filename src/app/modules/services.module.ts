import {NgModule} from '@angular/core';
import {IngredientService} from '../services/ingredient.service';
import {RecipeService} from '../services/recipe.service';
import {UserService} from '../services/user.service';

@NgModule({
  providers: [UserService, IngredientService, RecipeService],
})
export class ServicesModule {
}

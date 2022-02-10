import {NgModule} from '@angular/core';
import {IngredientService} from '../services/ingredient.service';
import {RecipeService} from '../services/recipe.service';
import {UploadService} from '../services/upload.service';
import {UserService} from '../services/user.service';
import {UploadService} from "../services/upload.service";

@NgModule({
  providers: [UserService, IngredientService, RecipeService, UploadService],
})
export class ServicesModule {
}

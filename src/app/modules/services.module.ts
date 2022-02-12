import {NgModule} from '@angular/core';
import {IngredientService} from '../services/ingredient.service';
import {KitchenIngredientService} from '../services/kitchen.service';
import {RecipeService} from '../services/recipe.service';
import {ScanService} from '../services/scan.service';
import {UploadService} from '../services/upload.service';
import {UserService} from '../services/user.service';

@NgModule({
  providers: [
    UserService,
    IngredientService,
    RecipeService,
    UploadService,
    ScanService,
    KitchenIngredientService
  ],
})
export class ServicesModule {
}

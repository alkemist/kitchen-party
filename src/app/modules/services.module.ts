import { NgModule } from '@angular/core';
import { FilterService } from 'primeng/api';
import { IngredientService } from '../services/ingredient.service';
import { KitchenIngredientService } from '../services/kitchen.service';
import { LoggerService } from '../services/logger.service';
import { RecipeService } from '../services/recipe.service';
import { SearchService } from '../services/search.service';
import { ShoppingService } from '../services/shopping.service';
import { TranslatorService } from '../services/translator.service';
import { UploadService } from '../services/upload.service';
import { UserService } from '../services/user.service';

@NgModule({
  providers: [
    UserService,
    IngredientService,
    RecipeService,
    UploadService,
    SearchService,
    ShoppingService,
    FilterService,
    TranslatorService,
    KitchenIngredientService,
    LoggerService,
  ],
})
export class ServicesModule {
}

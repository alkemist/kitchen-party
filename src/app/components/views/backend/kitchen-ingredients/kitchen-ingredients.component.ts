import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IngredientTypeEnum } from '../../../../enums/ingredient-type.enum';
import { KitchenIngredientModel } from '../../../../models/kitchen-ingredient.model';
import { KitchenIngredientService } from '../../../../services/kitchen.service';
import { TranslatorService } from '../../../../services/translator.service';
import { EnumHelper } from '../../../../tools/enum.helper';

@Component({
  selector: 'app-kitchen-ingredients',
  templateUrl: './kitchen-ingredients.component.html',
  styleUrls: [ './kitchen-ingredients.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class KitchenIngredientsComponent implements OnInit {
  kitchenIngredients: KitchenIngredientModel[] = [];
  ingredientTypes = EnumHelper.enumToObject(IngredientTypeEnum);
  loading = true;

  constructor(private kitchenIngredientService: KitchenIngredientService, private router: Router, private translatorService: TranslatorService) {
  }

  async ngOnInit(): Promise<void> {
    this.kitchenIngredientService.getListOrRefresh().then(kitchenIngredients => {
      this.kitchenIngredients = kitchenIngredients;
      this.loading = false;
    });
    this.ingredientTypes = await this.translatorService.translateLabels(this.ingredientTypes);
  }
}

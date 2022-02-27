import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IngredientTypeLabelEnum } from '../../../../enums';
import { KitchenIngredientModel } from '../../../../models';
import { KitchenIngredientService, TranslatorService } from '../../../../services';
import { EnumHelper } from '../../../../tools';

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
  ingredientTypes = EnumHelper.enumToObject(IngredientTypeLabelEnum);
  loading = true;

  constructor(
    private kitchenIngredientService: KitchenIngredientService,
    private router: Router,
    private translatorService: TranslatorService) {
  }

  async ngOnInit(): Promise<void> {
    this.kitchenIngredientService.getListOrRefresh().then(kitchenIngredients => {
      this.kitchenIngredients = kitchenIngredients;
      this.loading = false;
    });
    this.ingredientTypes = await this.translatorService.translateLabels(this.ingredientTypes);
  }
}

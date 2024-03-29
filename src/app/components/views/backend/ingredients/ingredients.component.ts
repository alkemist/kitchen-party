import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IngredientTypeLabelEnum } from '@enums';
import { IngredientModel } from '@models';
import { IngredientService, TranslatorService } from '@services';
import { EnumHelper } from '@tools';

@Component({
  selector: 'app-back-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: [ './ingredients.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class IngredientsComponent implements OnInit {
  ingredients: IngredientModel[] = [];
  ingredientTypes = EnumHelper.enumToObject(IngredientTypeLabelEnum);
  loading = true;

  constructor(
    private ingredientService: IngredientService,
    private router: Router,
    private translatorService: TranslatorService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.ingredientService.getListOrRefresh().then(ingredients => {
      this.ingredients = ingredients;
      this.loading = false;
    });
    this.ingredientTypes = await this.translatorService.translateLabels(this.ingredientTypes);
  }
}

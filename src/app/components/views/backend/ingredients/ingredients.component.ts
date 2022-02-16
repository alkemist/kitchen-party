import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {IngredientTypeEnum} from '../../../../enums/ingredient-type.enum';
import {IngredientModel} from '../../../../models/ingredient.model';
import {IngredientService} from '../../../../services/ingredient.service';
import {TranslatorService} from '../../../../services/translator.service';
import {EnumHelper} from '../../../../tools/enum.helper';

@Component({
  selector: 'app-back-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class IngredientsComponent implements OnInit {
  ingredients: IngredientModel[] = [];
  ingredientTypes = EnumHelper.enumToObject(IngredientTypeEnum);
  loading = true;

  constructor(private ingredientService: IngredientService, private router: Router, private translatorService: TranslatorService) {
  }

  async ngOnInit(): Promise<void> {
    this.ingredientService.getListOrRefresh().then(ingredients => {
      this.ingredients = ingredients;
      this.loading = false;
    });
    this.ingredientTypes = await this.translatorService.translateLabels(this.ingredientTypes);
  }
}

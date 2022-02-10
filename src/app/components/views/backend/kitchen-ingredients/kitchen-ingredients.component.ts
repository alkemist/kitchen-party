import {Component, OnInit} from '@angular/core';
import {EnumHelper} from "../../../../tools/enum.helper";
import {IngredientTypeEnum} from "../../../../enums/ingredient-type.enum";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {KitchenIngredientService} from "../../../../services/kitchen.service";
import {KitchenIngredientModel} from "../../../../models/kitchen-ingredient.model";

@Component({
  selector: 'app-kitchen-ingredients',
  templateUrl: './kitchen-ingredients.component.html',
  styleUrls: ['./kitchen-ingredients.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class KitchenIngredientsComponent implements OnInit {
  kitchenIngredients: KitchenIngredientModel[] = [];
  ingredientTypes = EnumHelper.enumToObject(IngredientTypeEnum);
  loading = true;

  constructor(private kitchenIngredientService: KitchenIngredientService, private router: Router, private translateService: TranslateService) {
  }

  async ngOnInit(): Promise<void> {
    this.kitchenIngredientService.getListOrRefresh().then(kitchenIngredients => {
      this.kitchenIngredients = kitchenIngredients;
      this.loading = false;
    });
    this.translateService.getTranslation('fr').subscribe(() => {
      this.ingredientTypes = this.ingredientTypes.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
    });
  }
}

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {IngredientTypeEnum} from '../../../../enums/ingredient-type.enum';
import {IngredientModel} from '../../../../models/ingredient.model';
import {IngredientService} from '../../../../services/ingredient.service';
import {EnumHelper} from '../../../../tools/enum.helper';

@Component({
  selector: 'app-ingredients',
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

  constructor(private ingredientService: IngredientService, private router: Router, private translateService: TranslateService) {
  }

  async ngOnInit(): Promise<void> {
    this.ingredientService.getListOrRefresh().then(ingredients => {
      this.ingredients = ingredients;
      this.loading = false;
    });
    this.translateService.getTranslation('fr').subscribe(() => {
      this.ingredientTypes = this.ingredientTypes.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
    });
  }
}

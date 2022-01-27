import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {RecipeTypeEnum} from '../../../../enums/recipe-type.enum';
import {RecipeModel} from '../../../../models/recipe.model';
import {RecipeService} from '../../../../services/recipe.service';
import {EnumHelper} from '../../../../tools/enum.helper';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class RecipesComponent implements OnInit {
  recipes: RecipeModel[] = [];
  recipeTypes = EnumHelper.enumToObject(RecipeTypeEnum);
  loading = true;

  constructor(private recipeService: RecipeService, private router: Router, private translateService: TranslateService) {
  }

  async ngOnInit(): Promise<void> {
    this.recipeService.refreshList().then(recipes => {
      this.recipes = recipes;
      this.loading = false;
    });
    this.translateService.getTranslation('fr').subscribe(() => {
      this.recipeTypes = this.recipeTypes.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
    });
  }
}

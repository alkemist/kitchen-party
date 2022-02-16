import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RecipeTypeEnum} from '../../../../enums/recipe-type.enum';
import {RecipeModel} from '../../../../models/recipe.model';
import {RecipeService} from '../../../../services/recipe.service';
import {TranslatorService} from '../../../../services/translator.service';
import {EnumHelper} from '../../../../tools/enum.helper';

@Component({
  selector: 'app-back-recipes',
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

  constructor(private recipeService: RecipeService, private router: Router, private translatorService: TranslatorService) {
  }

  async ngOnInit(): Promise<void> {
    this.recipeTypes = await this.translatorService.translateLabels(this.recipeTypes);
    this.loadData();
  }

  loadData() {
    this.recipeService.getListOrRefresh().then(recipes => {
      this.recipes = recipes;
      this.loading = false;
    });
  }
}

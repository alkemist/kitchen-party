import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeTypeLabelEnum } from '@enums';
import { RecipeModel } from '@models';
import { RecipeService, RecipeV2Service, TranslatorService } from '@services';
import { EnumHelper } from '@tools';

@Component({
  selector: 'app-back-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: [ './recipes.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class RecipesComponent implements OnInit {
  recipes: RecipeModel[] = [];
  recipeTypes = EnumHelper.enumToObject(RecipeTypeLabelEnum);
  loading = true;

  constructor(
    private recipeService: RecipeService,
    private recipeV2Service: RecipeV2Service,
    private router: Router,
    private translatorService: TranslatorService
  ) {
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

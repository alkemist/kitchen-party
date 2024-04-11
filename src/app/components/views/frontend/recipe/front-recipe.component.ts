import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeasureUnitLabelEnum, RecipeTypeLabelEnum } from '@enums';
import { RecipeIngredientModel, RecipeModel } from '@models';
import { TranslatorService, UserService } from '@services';
import { EnumHelper } from '@tools';
import { DataStoreUserInterface } from '@alkemist/ngx-data-store';

@Component({
  selector: 'app-front-recipe',
  templateUrl: './front-recipe.component.html',
  styleUrls: [ './front-recipe.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class FrontRecipeComponent implements OnInit {
  recipeTypes = EnumHelper.enumToObject(RecipeTypeLabelEnum);
  measureUnits = EnumHelper.enumToObject(MeasureUnitLabelEnum);
  recipe = new RecipeModel({});
  diet: string = '';
  loading = true;
  loggedUser?: DataStoreUserInterface;
  noExist = false;

  constructor(
    private route: ActivatedRoute,
    private translatorService: TranslatorService,
    private userService: UserService) {
  }

  async ngOnInit(): Promise<void> {
    this.route.data.subscribe(
      ((data: any) => {
        if (data && data['recipe']) {
          this.recipe = data['recipe'];

          if (data['diet']) {
            this.diet = data['diet'];
            this.recipe.recipeIngredients = this.recipe.recipeIngredientsOption(this.diet);
          }

        } else {
          this.noExist = true;
        }
        this.loading = false;
      }));

    this.recipeTypes = await this.translatorService.translateLabels(this.recipeTypes);
    this.measureUnits = await this.translatorService.translateLabels(this.measureUnits);

    this.loggedUser = await this.userService.getLoggedUser();
  }

  unitOrMeasureToString(recipeIngredient: RecipeIngredientModel): string | undefined {
    return RecipeIngredientModel.unitOrMeasureToString(recipeIngredient, this.measureUnits);
  }
}

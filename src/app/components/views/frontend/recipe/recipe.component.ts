import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeasureUnitEnum, RecipeTypeEnum } from '../../../../enums';
import { RecipeInterface, UserInterface } from '../../../../interfaces';
import { RecipeIngredientModel, RecipeModel } from '../../../../models';
import { TranslatorService, UserService } from '../../../../services';
import { EnumHelper } from '../../../../tools';

@Component({
  selector: 'app-front-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: [ './recipe.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class FrontRecipeComponent implements OnInit {
  recipeTypes = EnumHelper.enumToObject(RecipeTypeEnum);
  measureUnits = EnumHelper.enumToObject(MeasureUnitEnum);
  recipe = new RecipeModel({} as RecipeInterface);
  diet: string = '';
  loading = true;
  loggedUser?: UserInterface;

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

          this.loading = false;
        }
      }));

    this.recipeTypes = await this.translatorService.translateLabels(this.recipeTypes);
    this.measureUnits = await this.translatorService.translateLabels(this.measureUnits);

    await this.userService.getLoggedUser((loggedUser) => {
      this.loggedUser = loggedUser;
    });
  }

  unitOrMeasureToString(recipeIngredient: RecipeIngredientModel): string | undefined {
    return RecipeIngredientModel.unitOrMeasureToString(recipeIngredient, this.measureUnits);
  }
}

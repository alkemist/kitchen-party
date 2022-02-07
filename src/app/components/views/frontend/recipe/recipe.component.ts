import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {User} from 'firebase/auth';
import {MeasureUnitEnum} from '../../../../enums/measure-unit.enum';
import {RecipeTypeEnum} from '../../../../enums/recipe-type.enum';
import {RecipeIngredientModel} from '../../../../models/recipe-ingredient.model';
import {RecipeInterface, RecipeModel} from '../../../../models/recipe.model';
import {UserService} from '../../../../services/user.service';
import {EnumHelper} from '../../../../tools/enum.helper';

@Component({
  selector: 'app-front-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class FrontRecipeComponent implements OnInit {
  recipeTypes = EnumHelper.enumToObject(RecipeTypeEnum);
  measureUnits = EnumHelper.enumToObject(MeasureUnitEnum);
  recipe = new RecipeModel({} as RecipeInterface);
  loading = true;
  loggedUser?: User;

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private userService: UserService) {
  }

  async ngOnInit(): Promise<void> {
    this.route.data.subscribe(
      (data => {
        if (data && data['recipe']) {
          this.recipe = data['recipe'];
          this.loading = false;
        }
      }));

    this.translateService.getTranslation('fr').subscribe(() => {
      this.recipeTypes = this.recipeTypes.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
      this.measureUnits = this.measureUnits.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
    });

    await this.userService.getLoggedUser((loggedUser) => {
      this.loggedUser = loggedUser;
    });
  }

  unitOrMeasureToString(recipeIngredient: RecipeIngredientModel): string | undefined {
    return RecipeIngredientModel.unitOrMeasureToString(recipeIngredient, this.measureUnits);
  }
}

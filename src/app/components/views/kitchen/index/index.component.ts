import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {IngredientModel} from '../../../../models/ingredient.model';
import {RecipeModel} from '../../../../models/recipe.model';
import {IngredientService} from '../../../../services/ingredient.service';
import {RecipeService} from '../../../../services/recipe.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class IndexComponent implements OnInit {
  ingredients: IngredientModel[] = [];
  recipes: RecipeModel[] = [];
  loading = true;

  constructor(
    private ingredientService: IngredientService,
    private recipeService: RecipeService,
    private router: Router
  ) {
    this.recipeService.getListOrRefresh().then(recipes => {
      this.recipes = recipes;
      this.ingredientService.getListOrRefresh().then(ingredients => {
        this.ingredients = ingredients;
        this.loading = false;
      });
    });
  }

  ngOnInit(): void {
  }

}

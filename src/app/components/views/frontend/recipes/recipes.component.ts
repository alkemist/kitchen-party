import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {DietTypes} from '../../../../enums/diet-type.enum';
import {RecipeModel} from '../../../../models/recipe.model';
import {RecipeService} from '../../../../services/recipe.service';
import {SearchService} from '../../../../services/search.service';
import {SweetSalty, SweetSaltyEnum} from "../../../../enums/sweet-salty.enum";

@Component({
  selector: 'app-front-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class FrontRecipesComponent implements OnInit, OnDestroy {
  recipes: RecipeModel[] = [];
  filteredRecipes: RecipeModel[] = [];
  loading = true;
  subscription: Subscription;

  constructor(
    private recipeService: RecipeService,
    private searchService: SearchService
  ) {
    this.recipeService.getListOrRefresh().then(recipes => {
      this.recipes = recipes;
      this.filteredRecipes = recipes;
      this.loading = false;
    });
    this.subscription = this.searchService.filters.valueChanges.subscribe((filters) => {
      this.filter(filters);
    });
  }

  get selectedRecipes() {
    return this.searchService.selectedRecipes;
  }

  set selectedRecipes(selectedRecipes) {
    this.searchService.selectedRecipes = selectedRecipes;
  }

  filter(filters: { diet: string, type: string, name: string, sweetOrSalty: string, ingredients: string[] }) {
    this.filteredRecipes = this.recipes.filter((recipe: RecipeModel) => {
      let valid: boolean | null = true;

      if (valid && filters.diet) {
        valid = recipe.dietIs(DietTypes[filters.diet]);
      }
      if (valid && filters.type) {
        valid = recipe.type! && recipe.type === filters.type;
      }
      if (valid && filters.sweetOrSalty) {
        valid = recipe.isSweet() && SweetSalty[filters.sweetOrSalty] === SweetSaltyEnum.sweet
          || recipe.isSalty() && SweetSalty[filters.sweetOrSalty] === SweetSaltyEnum.salty
      }
      if (valid && filters.name) {
        valid = recipe.nameContain(filters.name);
      }
      if (valid && filters.ingredients) {
        valid = filters.ingredients.every((filterIngredientId: string) => recipe.ingredientIds.some(recipeIngredientId => filterIngredientId === recipeIngredientId));
      }

      return valid;
    });
  }

  ngOnInit(): void {
    this.filter(this.searchService.filters.value);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

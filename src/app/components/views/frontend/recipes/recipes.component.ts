import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DietTypes } from '../../../../enums/diet-type.enum';
import { RecipeTypes } from '../../../../enums/recipe-type.enum';
import { SweetSalty, SweetSaltyEnum } from '../../../../enums/sweet-salty.enum';
import { IngredientModel } from '../../../../models/ingredient.model';
import { RecipeModel } from '../../../../models/recipe.model';
import { FilterService } from '../../../../services/filter.service';
import { IngredientService } from '../../../../services/ingredient.service';
import { RecipeService } from '../../../../services/recipe.service';
import { ShoppingService } from '../../../../services/shopping.service';
import { TranslatorService } from '../../../../services/translator.service';
import { ToolbarFilters } from '../../../layouts/header/header.component';

@Component({
  selector: 'app-front-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: [ './recipes.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class FrontRecipesComponent implements OnInit, OnDestroy {
  recipes: RecipeModel[] = [];
  ingredients: IngredientModel[] = [];
  filteredRecipes: RecipeModel[] = [];
  loading = true;
  subscription: Subscription;
  filterSummary: { key: string, value: string }[] = [];

  constructor(
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private filterService: FilterService,
    private shoppingService: ShoppingService,
    private translatorService: TranslatorService,
    private router: Router
  ) {
    this.recipeService.getListOrRefresh().then(recipes => {
      this.recipes = recipes;
      this.filteredRecipes = recipes;
      this.loading = false;
    });
    this.subscription = this.filterService.filters.valueChanges.subscribe((filters) => {
      this.filter(filters);
    });
  }

  get selectedRecipes() {
    return this.shoppingService.selectedRecipes;
  }

  set selectedRecipes(selectedRecipes) {
    this.shoppingService.selectedRecipes = selectedRecipes;
  }

  filter(filters: ToolbarFilters) {
    this.fillFilterSummary(filters);
    let recipes: RecipeModel[] = this.recipes;

    if (filters.diet) {
      recipes = recipes.map(recipe => {
        const recipeWithOption = new RecipeModel(recipe);
        recipeWithOption.recipeIngredients = recipeWithOption.recipeIngredientsOption(filters.diet);
        return recipeWithOption;
      });
    }

    this.filteredRecipes = recipes.filter((recipe: RecipeModel) => {
      let valid: boolean | null = true;

      if (valid && filters.name) {
        valid = recipe.nameContain(filters.name);
      }
      if (valid && filters.diet) {
        valid = recipe.dietIs(DietTypes[filters.diet]);
      }
      if (valid && filters.type) {
        valid = recipe.type! && recipe.type === filters.type;
      }
      if (valid && filters.sweetOrSalty) {
        valid = recipe.isSweet() && SweetSalty[filters.sweetOrSalty] === SweetSaltyEnum.sweet
          || recipe.isSalty() && SweetSalty[filters.sweetOrSalty] === SweetSaltyEnum.salty;
      }
      if (valid && filters.ingredients) {
        valid = filters.ingredients.every((filterIngredientId: string) => recipe.ingredientIds.some(recipeIngredientId => filterIngredientId === recipeIngredientId));
      }
      if (valid && filters.isSeason) {
        valid = recipe.isSeason();
      }

      return valid;
    });
  }

  removeFilter(key: string) {
    this.filterService.filters.get(key)?.patchValue('');
  }

  ngOnInit(): void {
    this.filter(this.filterService.filters.value);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  gotoRecipe(recipe: RecipeModel) {
    const route = [ '/', recipe.slug ];
    if (this.filterService.filters.get('diet')?.value) {
      route.push(this.filterService.filters.get('diet')?.value);
    }

    this.router.navigate(route);
  }

  private async fillFilterSummary(filters: ToolbarFilters) {
    this.filterSummary = [];

    if (filters.name) {
      this.filterSummary.push({
        key: 'name',
        value: `${ await this.translatorService.instant('Name contain') } "${ filters.name }"`
      });
    }
    if (filters.diet) {
      this.filterSummary.push({
        key: 'diet',
        value: await this.translatorService.instant(DietTypes[filters.diet])
      });
    }
    if (filters.type) {
      this.filterSummary.push({
        key: 'type',
        value: await this.translatorService.instant(RecipeTypes[filters.type])
      });
    }
    if (filters.sweetOrSalty) {
      this.filterSummary.push({
        key: 'sweetOrSalty',
        value: await this.translatorService.instant(SweetSalty[filters.sweetOrSalty])
      });
    }
    if (filters.ingredients && filters.ingredients.length > 0) {
      const ingredients: string[] = [];
      for (const ingredientId of filters.ingredients) {
        const ingredient = await this.ingredientService.getById(ingredientId);
        ingredients.push(ingredient?.name!);
      }
      this.filterSummary.push({
        key: 'ingredients',
        value: ingredients.join(', ')
      });
    }
    if (filters.isSeason) {
      this.filterSummary.push({
        key: 'isSeason',
        value: await this.translatorService.instant('In season')
      });
    }
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToolbarFilters } from '@app/components';
import { DietTypes, RecipeTypes, SweetSalty, SweetSaltyLabelEnum } from '@enums';
import { IngredientModel, RecipeModel } from '@models';
import { FilteringService, IngredientService, RecipeService, ShoppingService, TranslatorService } from '@services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-front-recipes',
  templateUrl: './front-recipes.component.html',
  styleUrls: [ './front-recipes.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class FrontRecipesComponent implements OnInit, OnDestroy {
  recipes: RecipeModel[] = [];
  ingredients: IngredientModel[] = [];
  filteredRecipes: RecipeModel[] = [];
  loading = true;
  subscription?: Subscription;
  filterSummary: { key: string, value: string }[] = [];

  constructor(
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private filteringService: FilteringService,
    private shoppingService: ShoppingService,
    private translatorService: TranslatorService
  ) {
  }

  get selectedRecipes() {
    return this.shoppingService.selectedRecipes;
  }

  set selectedRecipes(selectedRecipes) {
    this.shoppingService.selectedRecipes = selectedRecipes;
  }

  filter(filters: ToolbarFilters) {
    void this.fillFilterSummary(filters);
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
        valid = recipe.dietIs(DietTypes.get(filters.diet)!);
      }
      if (valid && filters.type) {
        valid = recipe.type! && recipe.type === filters.type;
      }
      if (valid && filters.nbSlices) {
        valid = recipe.nbSlices !== undefined && recipe.nbSlices >= filters.nbSlices;
      }
      if (valid && filters.sweetOrSalty) {
        valid = recipe.isSweet() && SweetSalty.get(filters.sweetOrSalty) === SweetSaltyLabelEnum.sweet
          || recipe.isSalty() && SweetSalty.get(filters.sweetOrSalty) === SweetSaltyLabelEnum.salty;
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
    this.filteringService.getFilters().get(key)?.patchValue('');
  }

  ngOnInit(): void {
    if (!this.subscription) {
      this.subscription = this.filteringService.getFilters().valueChanges.subscribe((filters) => {
        this.filter(filters);
      });
    }
    this.recipeService.getListOrRefresh().then(recipes => {
      this.recipes = recipes;
      this.filteredRecipes = recipes;
      this.filter(this.filteringService.getFilters().value);
      this.loading = false;
      this.filter(this.filteringService.getFilters().value);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  gotoRecipe(recipe: RecipeModel) {
    const route = [ '/', recipe.slug ];
    if (this.filteringService.getFilters().get('diet')?.value) {
      route.push(this.filteringService.getFilters().get('diet')?.value);
    }
    return route;
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
        value: await this.translatorService.instant(DietTypes.get(filters.diet)!)
      });
    }

    if (filters.type) {
      this.filterSummary.push({
        key: 'type',
        value: await this.translatorService.instant(RecipeTypes.get(filters.type)!)
      });
    }

    if (filters.nbSlices) {
      this.filterSummary.push({
        key: 'nbSlices',
        value: `${ filters.nbSlices.toString() } ${ await this.translatorService.instant('Slices') }`
      });
    }

    if (filters.sweetOrSalty) {
      this.filterSummary.push({
        key: 'sweetOrSalty',
        value: await this.translatorService.instant(SweetSalty.get(filters.sweetOrSalty)!)
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

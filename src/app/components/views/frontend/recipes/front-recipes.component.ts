import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToolbarFilters } from '@app/components';
import { DietTypes, SweetSalty, SweetSaltyLabelEnum } from '@enums';
import { IngredientModel, RecipeModel } from '@models';
import { FilteringService, IngredientService, RecipeService, UserService } from '@services';
import { Subscription } from 'rxjs';
import { CartRecipeService } from "@app/services/cart-recipe.service";
import { UserInterface } from '@interfaces';

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
  loggedUser: UserInterface | undefined;

  constructor(
    private recipeService: RecipeService,
    private filteringService: FilteringService,
    private ingredientService: IngredientService,
    private cartRecipeService: CartRecipeService,
    private userService: UserService,
  ) {
    this.filteringService.setIngredientService(ingredientService);
  }

  get filterSummary() {
    return this.filteringService.getFilterSummary();
  }

  filter(filters: ToolbarFilters) {
    void this.filteringService.fillFilterSummary(filters);
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

  async ngOnInit(): Promise<void> {
    if (!this.subscription) {
      this.subscription = this.filteringService.getFilters().valueChanges
        .subscribe((filters) => {
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
    await this.userService.getLoggedUser(async (loggedUser) => {
      this.loggedUser = loggedUser;
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

  async addToCart(recipe: RecipeModel) {
    await this.cartRecipeService.updateOrCreate(recipe);
  }
}

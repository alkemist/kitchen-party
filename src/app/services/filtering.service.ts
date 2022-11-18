import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ToolbarFilters} from "@components";
import {DietTypes, RecipeTypes, SweetSalty} from "@enums";
import {TranslatorService} from "@app/services/translator.service";
import {IngredientService} from "@app/services/ingredient.service";

@Injectable({
  providedIn: 'root'
})
export class FilteringService {
  private filters: FormGroup = new FormGroup({});
  protected filterSummary: { key: string, value: string }[] = [];
  private ingredientService?: IngredientService;

  constructor(
    private translatorService: TranslatorService
  ) {
  }

  getFilters(): FormGroup {
    return this.filters;
  }

  setFilters(form: FormGroup): void {
    this.filters = form;
  }

  async fillFilterSummary(filters: ToolbarFilters) {
    const filterSummary = [];

    if (filters.name) {
      filterSummary.push({
        key: 'name',
        value: `${await this.translatorService.instant('Name contain')} "${filters.name}"`
      });
    }

    if (filters.diet) {
      filterSummary.push({
        key: 'diet',
        value: await this.translatorService.instant(DietTypes.get(filters.diet)!)
      });
    }

    if (filters.type) {
      filterSummary.push({
        key: 'type',
        value: await this.translatorService.instant(RecipeTypes.get(filters.type)!)
      });
    }

    if (filters.nbSlices) {
      filterSummary.push({
        key: 'nbSlices',
        value: `${filters.nbSlices.toString()} ${await this.translatorService.instant('Slices')}`
      });
    }

    if (filters.sweetOrSalty) {
      filterSummary.push({
        key: 'sweetOrSalty',
        value: await this.translatorService.instant(SweetSalty.get(filters.sweetOrSalty)!)
      });
    }

    if (filters.ingredients && filters.ingredients.length > 0) {
      const ingredients: string[] = [];

      for (const ingredientId of filters.ingredients) {
        const ingredient = await this.ingredientService?.getById(ingredientId);
        ingredients.push(ingredient?.name!);
      }

      filterSummary.push({
        key: 'ingredients',
        value: ingredients.join(', ')
      });
    }

    if (filters.isSeason) {
      filterSummary.push({
        key: 'isSeason',
        value: await this.translatorService.instant('In season')
      });
    }

    this.filterSummary = [...new Map(filterSummary.map((item) => [item.key, item])).values()];
  }

  getFilterSummary() {
    return this.filterSummary;
  }

  setIngredientService(ingredientService: IngredientService) {
    this.ingredientService = ingredientService;
  }
}

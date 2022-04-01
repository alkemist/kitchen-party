import {
  DietTypeLabelEnum,
  IngredientTypeLabelEnum,
  MeasureUnitKeyEnum,
  MeasureUnitLabelEnum,
  MeasureUnits
} from '@enums';
import {
  HasIngredient,
  KeyLabelInterface,
  RecipeIngredientFormInterface,
  RecipeIngredientInterface
} from '@interfaces';
import { IngredientModel } from './ingredient.model';
import { RecipeModel } from './recipe.model';


export class RecipeIngredientModel implements RecipeIngredientInterface {
  static ingredientTypes = Object.keys(IngredientTypeLabelEnum);
  id?: string;
  quantity: number | null;
  measure: string;
  unit: MeasureUnitKeyEnum | null;

  ingredient?: IngredientModel;
  ingredientId?: string;

  recipe?: RecipeModel;
  recipeId?: string;

  optionCarne?: boolean;
  optionVege?: boolean;
  optionVegan?: boolean;

  constructor(recipeIngredient: RecipeIngredientInterface) {
    this.id = recipeIngredient.id ?? '';
    this.quantity = recipeIngredient.quantity ?? null;
    this.measure = recipeIngredient.measure?.trim() || '';
    this.unit = recipeIngredient.unit || null;

    this.optionCarne = recipeIngredient.optionCarne || false;
    this.optionVege = recipeIngredient.optionVege || false;
    this.optionVegan = recipeIngredient.optionVegan || false;

    if (recipeIngredient.ingredientId) {
      this.ingredientId = recipeIngredient.ingredientId;
    }
    if (recipeIngredient.ingredient) {
      this.ingredient = new IngredientModel(recipeIngredient.ingredient);
    }

    if (recipeIngredient.recipeId) {
      this.recipeId = recipeIngredient.recipeId;
    }
    if (recipeIngredient.recipe) {
      this.recipe = new RecipeModel(recipeIngredient.recipe);
    }
  }

  get baseQuantity(): { count: number, unit?: string, measure?: string } {
    let quantity = this.quantity || 0;


    const unit = this.unit ? MeasureUnits.get(this.unit) : null;

    switch (unit) {
      case MeasureUnitLabelEnum.tablespoon:
        return {
          count: quantity * 15,
          unit: this.ingredient?.isLiquid ? MeasureUnitLabelEnum.milliliter : MeasureUnitLabelEnum.gram
        };
      case MeasureUnitLabelEnum.teaspoon:
        return {
          count: quantity * 5,
          unit: this.ingredient?.isLiquid ? MeasureUnitLabelEnum.milliliter : MeasureUnitLabelEnum.gram
        };
      case MeasureUnitLabelEnum.centiliter:
        return {count: quantity * 10, unit: MeasureUnitLabelEnum.milliliter};
      case MeasureUnitLabelEnum.kilogram:
        return {count: quantity * 1000, unit: MeasureUnitLabelEnum.gram};
      case MeasureUnitLabelEnum.gram:
        return {count: quantity, unit: MeasureUnitLabelEnum.gram};
    }

    return {count: quantity, measure: this.measure};
  }

  get ingredientIds(): string[] {
    if (this.ingredient) {
      return [ this.ingredient.id! ];
    } else if (this.recipe) {
      return this.recipe.ingredientIds;
    }
    return [];
  }

  hasOption(option: string): boolean {
    if (option === DietTypeLabelEnum.meat && this.optionCarne) {
      return true;
    }
    if (option === DietTypeLabelEnum.vege && this.optionVege) {
      return true;
    }
    return option === DietTypeLabelEnum.vegan && this.optionVegan!;
  }

  static format(recipeIngredientForm: RecipeIngredientFormInterface, measureUnits: KeyLabelInterface[]): RecipeIngredientInterface {
    const recipeIngredient = {...recipeIngredientForm};

    const ingredientOrRecipe = recipeIngredientForm.ingredientOrRecipe;
    delete recipeIngredient.ingredientOrRecipe;

    if (ingredientOrRecipe) {
      if (ingredientOrRecipe instanceof RecipeModel) {
        recipeIngredient.recipe = ingredientOrRecipe;
      } else {
        recipeIngredient.ingredient = ingredientOrRecipe;
      }
    }

    const unitOrMeasure = recipeIngredientForm.unitOrMeasure;
    delete recipeIngredient.unitOrMeasure;

    if (unitOrMeasure) {
      let value = measureUnits.find(measureUnit => measureUnit.label === unitOrMeasure || measureUnit.key === unitOrMeasure)?.key!;

      if (MeasureUnits.get(value) !== undefined) {
        recipeIngredient.unit = value as MeasureUnitKeyEnum;
        recipeIngredient.measure = '';
      } else {
        recipeIngredient.measure = unitOrMeasure;
        recipeIngredient.unit = null;
      }
    }

    return recipeIngredient;
  }

  static unitOrMeasureToString(recipeIngredient: RecipeIngredientInterface, measureUnits: KeyLabelInterface[]): string | undefined {
    let unitOrMeasure = '';
    if (recipeIngredient.measure) {
      unitOrMeasure = recipeIngredient.measure;
    } else if (recipeIngredient.unit) {
      unitOrMeasure = measureUnits.find(measure => measure.key === recipeIngredient.unit)!.label;
    }

    return recipeIngredient.quantity && unitOrMeasure
      ? `${ recipeIngredient.quantity } ${ unitOrMeasure }`
      : recipeIngredient.quantity?.toString() ?? '';
  }

  static recipeIngredientToString(recipeIngredient: RecipeIngredientInterface, measureUnits: KeyLabelInterface[]): string {
    let str = '';
    const quantityDescription = RecipeIngredientModel.unitOrMeasureToString(recipeIngredient, measureUnits);

    let ingredientOrRecipe = null;
    if (recipeIngredient.recipe) {
      ingredientOrRecipe = recipeIngredient.recipe.name;
    } else if (recipeIngredient.ingredient) {
      ingredientOrRecipe = recipeIngredient.ingredient.name;
    }

    if (quantityDescription && ingredientOrRecipe) {
      str = `${ ingredientOrRecipe }:  ${ quantityDescription }`;
    } else if (ingredientOrRecipe) {
      str = `${ ingredientOrRecipe }`;
    }

    return str;
  }

  static orderRecipeIngredients<T extends HasIngredient>(recipeIngredients: T[]): T[] {
    return [ ...recipeIngredients ].sort((a, b) => {
      return RecipeIngredientModel.orderTwoRecipeIngredients(a, b);
    });
  }

  static orderTwoRecipeIngredients(a: HasIngredient, b: HasIngredient): number {
    if (!a.ingredient || !b.ingredient || !a.ingredient.name || !b.ingredient.name || !a.ingredient.type || !b.ingredient.type) {
      return 0;
    }

    const aNumber = RecipeIngredientModel.ingredientTypes.indexOf(a.ingredient.type);
    let bNumber = RecipeIngredientModel.ingredientTypes.indexOf(b.ingredient.type);

    if (aNumber == bNumber) {
      const aString = a.ingredient.name;
      const bString = b.ingredient.name;

      return (aString > bString) ? 1 : ((bString > aString) ? -1 : 0);
    }

    return (aNumber > bNumber) ? 1 : -1;
  }
}


import {
  DietTypeLabelEnum,
  IngredientTypeLabelEnum,
  MeasureUnitKeyEnum,
  MeasureUnitLabelEnum,
  MeasureUnits
} from '../enums';
import {
  HasIngredient,
  KeyLabelInterface,
  RecipeIngredientFormInterface,
  RecipeIngredientInterface
} from '../interfaces';
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
    this.id = recipeIngredient.id;
    this.quantity = parseInt(recipeIngredient.quantity?.toString()!) || null;
    this.measure = recipeIngredient.measure?.trim() || '';
    this.unit = recipeIngredient.unit || null;

    this.optionCarne = recipeIngredient.optionCarne || false;
    this.optionVege = recipeIngredient.optionVege || false;
    this.optionVegan = recipeIngredient.optionVegan || false;

    this.ingredientId = recipeIngredient.ingredientId;
    if (recipeIngredient.ingredient) {
      this.ingredient = new IngredientModel(recipeIngredient.ingredient);
    }

    this.recipeId = recipeIngredient.recipeId;
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

  static format(recipeIngredientForm: RecipeIngredientFormInterface, measureUnits: KeyLabelInterface[]): RecipeIngredientInterface {
    const recipeIngredient = {...recipeIngredientForm};

    const ingredientOrRecipe = recipeIngredientForm.ingredientOrRecipe;
    if (ingredientOrRecipe instanceof RecipeModel) {
      recipeIngredient.recipe = ingredientOrRecipe;
    } else {
      recipeIngredient.ingredient = ingredientOrRecipe;
    }

    const unitOrMeasure = recipeIngredientForm.unitOrMeasure;
    let value = measureUnits.find(measureUnit => measureUnit.label === unitOrMeasure || measureUnit.key === unitOrMeasure)?.key!;
    let isUnit = false;

    if (!value) {
      recipeIngredient.unit = null;
      recipeIngredient.measure = '';
      return recipeIngredient;
    }

    if (MeasureUnits.get(value) !== undefined) {
      isUnit = true;
    } else {
      const measureUnitKeys = Object.keys(MeasureUnitLabelEnum);
      const keyIndex = measureUnitKeys.indexOf(unitOrMeasure);
      if (keyIndex > -1) {
        isUnit = true;
        value = measureUnits[keyIndex].key;
      } else {
        const measureUnitValues = Object.values(MeasureUnitLabelEnum);
        const valueIndex = measureUnitValues.indexOf(unitOrMeasure as MeasureUnitLabelEnum);
        if (valueIndex > -1) {
          isUnit = true;
          value = measureUnits[valueIndex].key;
        }
      }
    }

    if (isUnit) {
      recipeIngredient.unit = value as MeasureUnitKeyEnum;
      recipeIngredient.measure = '';
    } else {
      recipeIngredient.measure = value;
      recipeIngredient.unit = null;
    }

    return recipeIngredient;
  }

  static unitOrMeasureToString(recipeIngredient: RecipeIngredientInterface, measureUnits: KeyLabelInterface[]): string | undefined {
    let unitOrMeasure = '';
    if (recipeIngredient.measure) {
      unitOrMeasure = recipeIngredient.measure;
    } else if (recipeIngredient.unit) {
      unitOrMeasure = measureUnits.find(measure => measure.key === recipeIngredient.unit)?.label!;
    }

    return recipeIngredient.quantity && unitOrMeasure
      ? `${ recipeIngredient.quantity } ${ unitOrMeasure }`
      : recipeIngredient.quantity?.toString();
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

  static orderRecipeIngredients(recipeIngredients: HasIngredient[]): HasIngredient[] {
    return recipeIngredients.sort((a, b) => {
      return RecipeIngredientModel.orderTwoRecipeIngredients(a, b);
    });
  }

  static orderTwoRecipeIngredients(a: HasIngredient, b: HasIngredient): number {
    const aNumber = RecipeIngredientModel.ingredientTypes.indexOf(a.ingredient?.type!);
    let bNumber = RecipeIngredientModel.ingredientTypes.indexOf(b.ingredient?.type!);

    if (aNumber == bNumber) {
      const aString = a.ingredient?.name!;
      const bString = b.ingredient?.name!;

      return (aString > bString) ? 1 : ((bString > aString) ? -1 : 0);
    }

    return (aNumber > bNumber) ? 1 : ((bNumber > aNumber) ? -1 : 0);
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
}


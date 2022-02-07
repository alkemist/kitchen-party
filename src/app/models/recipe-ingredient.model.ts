import {MeasureUnitEnum, MeasureUnits} from '../enums/measure-unit.enum';
import {IngredientInterface, IngredientModel} from './ingredient.model';
import {KeyObject} from './other.model';
import {RecipeInterface, RecipeModel} from './recipe.model';

export interface RecipeIngredientInterface {
  id?: string,
  quantity?: number | null,
  measure?: string,
  unit?: MeasureUnitEnum | null,

  ingredient?: IngredientInterface,
  ingredientId?: string,
  recipe?: RecipeInterface,
  recipeId?: string,
}

export interface RecipeIngredientFormInterface extends RecipeIngredientInterface {
  unitOrMeasure: MeasureUnitEnum | string;
  ingredientOrRecipe: IngredientModel | RecipeModel;
}

export class RecipeIngredientModel implements RecipeIngredientInterface {
  id?: string;
  quantity: number | null;
  measure: string;
  unit: MeasureUnitEnum | null;

  ingredient?: IngredientModel;
  ingredientId?: string;

  recipe?: RecipeModel;
  recipeId?: string;

  constructor(recipeIngredient: RecipeIngredientInterface) {
    this.id = recipeIngredient.id;
    this.quantity = parseInt(recipeIngredient.quantity?.toString()!) || null;
    this.measure = recipeIngredient.measure?.trim() || '';
    this.unit = recipeIngredient.unit || null;

    this.ingredientId = recipeIngredient.ingredientId;
    if (recipeIngredient.ingredient) {
      this.ingredient = new IngredientModel(recipeIngredient.ingredient);
    }

    this.recipeId = recipeIngredient.recipeId;
    if (recipeIngredient.recipe) {
      this.recipe = new RecipeModel(recipeIngredient.recipe);
    }
  }

  getEquivalentGram(): number {
    return 0;
  }

  static format(recipeIngredientForm: RecipeIngredientFormInterface, measureUnits: KeyObject[]): RecipeIngredientInterface {
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

    if (MeasureUnits[value] !== undefined) {
      isUnit = true;
    } else {
      const measureUnitKeys = Object.keys(MeasureUnitEnum);
      const keyIndex = measureUnitKeys.indexOf(unitOrMeasure);
      if (keyIndex > -1) {
        isUnit = true;
        value = measureUnits[keyIndex].key;
      } else {
        const measureUnitValues = Object.values(MeasureUnitEnum);
        const valueIndex = measureUnitValues.indexOf(unitOrMeasure as MeasureUnitEnum);
        if (valueIndex > -1) {
          isUnit = true;
          value = measureUnits[valueIndex].key;
        }
      }
    }

    if (isUnit) {
      recipeIngredient.unit = value as MeasureUnitEnum;
      recipeIngredient.measure = '';
    } else {
      recipeIngredient.measure = value;
      recipeIngredient.unit = null;
    }

    return recipeIngredient;
  }

  static unitOrMeasureToString(recipeIngredient: RecipeIngredientInterface, measureUnits: KeyObject[]): string | undefined {
    let unitOrMeasure = '';
    if (recipeIngredient.measure) {
      unitOrMeasure = recipeIngredient.measure;
    } else if (recipeIngredient.unit) {
      unitOrMeasure = measureUnits.find(measure => measure.key === recipeIngredient.unit)?.label!;
    }

    return recipeIngredient.quantity && unitOrMeasure
      ? `${recipeIngredient.quantity} ${unitOrMeasure}`
      : recipeIngredient.quantity?.toString();
  }

  static recipeIngredientToString(recipeIngredient: RecipeIngredientInterface, measureUnits: KeyObject[]): string {
    let str = '';
    const quantityDescription = RecipeIngredientModel.unitOrMeasureToString(recipeIngredient, measureUnits);

    let ingredientOrRecipe = null;
    if (recipeIngredient.recipe) {
      ingredientOrRecipe = recipeIngredient.recipe.name;
    } else if (recipeIngredient.ingredient) {
      ingredientOrRecipe = recipeIngredient.ingredient.name;
    }

    if (quantityDescription && ingredientOrRecipe) {
      str = `${ingredientOrRecipe}:  ${quantityDescription}`;
    } else if (ingredientOrRecipe) {
      str = `${ingredientOrRecipe}`;
    }

    return str;
  }
}


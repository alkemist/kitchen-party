import {MeasureUnitEnum, MeasureUnits} from '../enums/measure-unit.enum';
import {IngredientModel} from './ingredient.model';
import {KeyObject} from './other.model';
import {RecipeModel} from './recipe.model';

export interface RecipeIngredientInterface {
  id?: string,
  quantity?: number | null,
  measure?: string,
  unit?: MeasureUnitEnum | null,

  ingredient?: IngredientModel,
  ingredientId?: string,
  recipe?: RecipeModel,
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

  static import(recipeIngredientForm: RecipeIngredientFormInterface, measureUnits: KeyObject[]): RecipeIngredientModel {
    const recipeIngredient = new RecipeIngredientModel(recipeIngredientForm);

    const ingredientOrRecipe = recipeIngredientForm.ingredientOrRecipe;
    if (ingredientOrRecipe instanceof RecipeModel) {
      recipeIngredient.recipe = ingredientOrRecipe;
    } else {
      recipeIngredient.ingredient = ingredientOrRecipe;
    }

    recipeIngredient.setUnitOrMeasure(recipeIngredientForm.unitOrMeasure, measureUnits);

    return recipeIngredient;
  }

  setUnitOrMeasure(unitOrMeasure: string, measureUnits: KeyObject[]) {
    let value = measureUnits.find(measureUnit => measureUnit.label === unitOrMeasure || measureUnit.key === unitOrMeasure)?.key!;
    let isUnit = false;

    if (!value) {
      this.unit = null;
      this.measure = '';
      return;
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
      this.unit = value as MeasureUnitEnum;
      this.measure = '';
    } else {
      this.measure = value;
      this.unit = null;
    }
  }

  unitOrMeasureToString(measureUnits: KeyObject[]): string | undefined {
    let unitOrMeasure = '';
    if (this.measure) {
      unitOrMeasure = this.measure;
    } else if (this.unit) {
      unitOrMeasure = measureUnits.find(measure => measure.key === this.unit)?.label!;
    }

    return this.quantity && unitOrMeasure
      ? `${this.quantity} ${unitOrMeasure}`
      : this.quantity?.toString();
  }

  getEquivalentGram(): number {
    return 0;
  }

  toString(measureUnits: KeyObject[]): string {
    let str = '';
    const quantityDescription = this.unitOrMeasureToString(measureUnits);

    let ingredientOrRecipe = null;
    if (this.recipe) {
      ingredientOrRecipe = this.recipe.name;
    } else if (this.ingredient) {
      ingredientOrRecipe = this.ingredient.name;
    }

    if (quantityDescription && ingredientOrRecipe) {
      str = `${ingredientOrRecipe}:  ${quantityDescription}`;
    } else if (ingredientOrRecipe) {
      str = `${ingredientOrRecipe}`;
    }

    return str;
  }
}


import {MeasureUnitEnum, MeasureUnits} from '../enums/measure-unit.enum';
import {IngredientModel} from './ingredient.model';
import {KitchenIngredientInterface, KitchenIngredientModel} from './kitchen-ingredient.model';
import {RecipeModel} from './recipe.model';

export interface RecipeIngredientInterface extends KitchenIngredientInterface {
  isMain: boolean,
  isBase: boolean,
  recipe?: RecipeModel,
  recipeId?: string,
}

export interface RecipeIngredientFormInterface extends RecipeIngredientInterface {
  unitOrMeasure: MeasureUnitEnum | string | { key: string, label: string };
  ingredientOrRecipe: IngredientModel | RecipeModel;
}

export class RecipeIngredientModel extends KitchenIngredientModel implements RecipeIngredientInterface {
  isMain: boolean;
  isBase: boolean;
  recipe?: RecipeModel;
  recipeId?: string;

  constructor(recipeIngredient: RecipeIngredientInterface) {
    super(recipeIngredient);
    delete this.id;

    this.isMain = recipeIngredient.isMain;
    this.isBase = recipeIngredient.isBase;

    this.recipe = recipeIngredient.recipe;
    this.recipeId = recipeIngredient.recipeId;
  }

  static import(recipeIngredientForm: RecipeIngredientFormInterface): RecipeIngredientModel {
    const recipeIngredient = new RecipeIngredientModel(recipeIngredientForm);

    const ingredientOrRecipe = recipeIngredientForm.ingredientOrRecipe;
    if (ingredientOrRecipe instanceof RecipeModel) {
      recipeIngredient.recipe = ingredientOrRecipe;
    } else {
      recipeIngredient.ingredient = ingredientOrRecipe;
    }

    if (recipeIngredientForm.unitOrMeasure) {
      const unitOrMeasure = typeof recipeIngredientForm.unitOrMeasure === 'string'
        ? recipeIngredientForm.unitOrMeasure
        : (recipeIngredientForm.unitOrMeasure as { key: string, label: string }).key;
      if (typeof MeasureUnits[unitOrMeasure] !== 'undefined') {
        recipeIngredient.unit = unitOrMeasure as MeasureUnitEnum;
      } else if (unitOrMeasure.length > 0) {
        recipeIngredient.measure = unitOrMeasure as string;
      }
    }

    return recipeIngredient;
  }

  quantityDescription(measureUnits: { key: string, label: string }[]) {
    const strArray = [];
    if (this.quantity) {
      strArray.push(this.quantity);
    }
    if (this.measure) {
      strArray.push(this.measure);
    } else if (this.unit) {
      strArray.push(measureUnits.find(measure => measure.key === this.unit)?.label);
    }
    return strArray.join(' ');
  }

  override toString(measureUnits: { key: string, label: string }[]): string {
    const strArray = [];
    const quantityDescription = this.quantityDescription(measureUnits);
    if (quantityDescription) {
      strArray.push(quantityDescription);
    }

    if (this.recipe) {
      strArray.push(this.recipe.name);
    } else if (this.ingredient) {
      strArray.push(this.ingredient.name);
    }

    return strArray.join(' ');
  }
}


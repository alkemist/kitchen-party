import {MeasureUnitEnum, MeasureUnits} from '../enums/measure-unit.enum';
import {IngredientModel} from './ingredient.model';
import {RecipeModel} from './recipe.model';
import {FirestoreDataConverter} from "@firebase/firestore";
import {DocumentSnapshot, SnapshotOptions, WithFieldValue} from "firebase/firestore";

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
  unitOrMeasure: MeasureUnitEnum | string | { key: string, label: string };
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

  unitOrMeasureToString(measureUnits: { key: string, label: string }[]): string | undefined {
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

  toString(measureUnits: { key: string, label: string }[]): string {
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

export class KitchenIngredientModel extends RecipeIngredientModel {

}

export const kitchenIngredientConverter: FirestoreDataConverter<RecipeIngredientModel> = {
  toFirestore: (kitchenIngredient: WithFieldValue<RecipeIngredientModel>) => {
    const kitchenIngredientFields = {...kitchenIngredient};
    delete kitchenIngredientFields.id;
    return kitchenIngredientFields;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return new RecipeIngredientModel(data as RecipeIngredientFormInterface);
  }
};


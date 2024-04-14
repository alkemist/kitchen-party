import { DietTypeLabelEnum, MeasureUnitKeyEnum, MeasureUnits } from '@enums';
import { KeyLabelInterface, RecipeIngredientFormInterface, RecipeIngredientInterface, } from '@interfaces';
import { RecipeModel } from './recipe.model';
import { RelationIngredientModel } from "@app/models/relation-ingredient.model";


export class RecipeIngredientModel extends RelationIngredientModel implements RecipeIngredientInterface {
  optionCarne?: boolean;
  optionVege?: boolean;
  optionVegan?: boolean;

  recipe?: RecipeModel;
  recipeId?: string;

  constructor(recipeIngredient: RecipeIngredientInterface) {
    super(recipeIngredient);

    if (recipeIngredient.recipeId) {
      this.recipeId = recipeIngredient.recipeId;
    }
    if (recipeIngredient.recipe) {
      this.recipe = new RecipeModel(recipeIngredient.recipe);
    }

    this.optionCarne = recipeIngredient.optionCarne || false;
    this.optionVege = recipeIngredient.optionVege || false;
    this.optionVegan = recipeIngredient.optionVegan || false;
  }

  override get ingredientIds(): string[] {
    if (this.ingredient) {
      return [ this.ingredient.id! ];
    } else if (this.recipe) {
      return this.recipe.ingredientIds;
    }
    return [];
  }

  static import(recipeIngredientForm: RecipeIngredientFormInterface, measureUnits: KeyLabelInterface[]): RecipeIngredientModel {
    const recipeIngredient = { ...recipeIngredientForm };

    const ingredientOrRecipe = recipeIngredientForm.ingredientOrRecipe;
    delete recipeIngredient.ingredientOrRecipe;
    delete recipeIngredient.id;

    if (ingredientOrRecipe) {
      if (ingredientOrRecipe instanceof RecipeModel) {
        recipeIngredient.recipeId = ingredientOrRecipe.id;
      } else {
        recipeIngredient.ingredientId = ingredientOrRecipe.id;
      }
    }

    // @TODO à refactoriser
    let unitOrMeasure = recipeIngredientForm.unitOrMeasure;
    if ((unitOrMeasure as KeyLabelInterface).key !== undefined) {
      unitOrMeasure = (unitOrMeasure as KeyLabelInterface).key;
    }

    delete recipeIngredient.unitOrMeasure;

    if (unitOrMeasure) {
      let value = measureUnits.find(measureUnit => measureUnit.label === unitOrMeasure || measureUnit.key === unitOrMeasure)?.key!;

      if (MeasureUnits.get(value) !== undefined) {
        recipeIngredient.unit = value as MeasureUnitKeyEnum;
        recipeIngredient.measure = '';
      } else {
        recipeIngredient.measure = unitOrMeasure as string;
        recipeIngredient.unit = null;
      }
    }

    return new RecipeIngredientModel(recipeIngredient);
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

  hasOption(option: string): boolean {
    if (option === DietTypeLabelEnum.meat && this.optionCarne) {
      return true;
    }
    if (option === DietTypeLabelEnum.vege && this.optionVege) {
      return true;
    }
    return option === DietTypeLabelEnum.vegan && this.optionVegan!;
  }

  toStore() {
    const data: Record<string, any> = {
      quantity: this.quantity,
      measure: this.measure,
      unit: this.unit,

      optionCarne: this.optionCarne,
      optionVege: this.optionVege,
      optionVegan: this.optionVegan,
    }

    if (this.recipeId) data['recipeId'] = this.recipeId;
    if (this.ingredientId) data['ingredientId'] = this.ingredientId;

    return data
  }
}


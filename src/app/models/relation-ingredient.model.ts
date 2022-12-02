import {IngredientTypeLabelEnum, MeasureUnitKeyEnum, MeasureUnitLabelEnum, MeasureUnits} from '@enums';
import {HasIngredient, KeyLabelInterface, RelationIngredientInterface,} from '@interfaces';
import {IngredientModel} from './ingredient.model';

export class RelationIngredientModel implements RelationIngredientInterface {
  static ingredientTypes = Object.keys(IngredientTypeLabelEnum);
  id?: string;
  quantity: number | null;
  measure: string;
  unit: MeasureUnitKeyEnum | null;

  ingredient?: IngredientModel;
  ingredientId?: string;

  constructor(relationIngredient: RelationIngredientInterface) {
    this.id = relationIngredient.id ?? '';
    this.quantity = relationIngredient.quantity ?? null;
    this.measure = relationIngredient.measure?.trim() || '';
    this.unit = relationIngredient.unit || null;

    if (relationIngredient.ingredientId) {
      this.ingredientId = relationIngredient.ingredientId;
    }
    if (relationIngredient.ingredient) {
      this.ingredient = new IngredientModel(relationIngredient.ingredient);
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
    }
    return [];
  }

  static unitOrMeasureToString(relationIngredient: RelationIngredientInterface, measureUnits: KeyLabelInterface[]): string | undefined {
    let unitOrMeasure = '';
    if (relationIngredient.measure) {
      unitOrMeasure = relationIngredient.measure;
    } else if (relationIngredient.unit) {
      unitOrMeasure = measureUnits.find(measure => measure.key === relationIngredient.unit)!.label;
    }

    return relationIngredient.quantity && unitOrMeasure
      ? `${ relationIngredient.quantity } ${ unitOrMeasure }`
      : relationIngredient.quantity?.toString() ?? '';
  }

  static relationIngredientToString(relationIngredient: RelationIngredientInterface, measureUnits: KeyLabelInterface[]): string {
    let str = '';
    const quantityDescription = RelationIngredientModel.unitOrMeasureToString(relationIngredient, measureUnits);

    let ingredientOrRecipe = null;
    if (relationIngredient.ingredient) {
      ingredientOrRecipe = relationIngredient.ingredient.name;
    }

    if (quantityDescription && ingredientOrRecipe) {
      str = `${ ingredientOrRecipe }:  ${ quantityDescription }`;
    } else if (ingredientOrRecipe) {
      str = `${ ingredientOrRecipe }`;
    }

    return str;
  }

  static orderRelationIngredients<T extends HasIngredient>(relationIngredients: T[]): T[] {
    return [ ...relationIngredients ].sort((a, b) => {
      return RelationIngredientModel.orderTwoRelationIngredients(a, b);
    });
  }

  static orderTwoRelationIngredients(a: HasIngredient, b: HasIngredient): number {
    if (!a.ingredient || !b.ingredient || !a.ingredient.name || !b.ingredient.name || !a.ingredient.type || !b.ingredient.type) {
      return 0;
    }

    const aNumber = RelationIngredientModel.ingredientTypes.indexOf(a.ingredient.type);
    let bNumber = RelationIngredientModel.ingredientTypes.indexOf(b.ingredient.type);

    if (aNumber == bNumber) {
      const aString = a.ingredient.name;
      const bString = b.ingredient.name;

      return (aString > bString) ? 1 : ((bString > aString) ? -1 : 0);
    }

    return (aNumber > bNumber) ? 1 : -1;
  }
}


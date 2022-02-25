import { EnumHelper } from '../tools';

export enum MeasureUnitKeyEnum {
  gram = 'gram',
  kilogram = 'kilogram',
  milliliter = 'milliliter',
  centiliter = 'centiliter',
  liter = 'liter',
  tablespoon = 'tablespoon',
  teaspoon = 'teaspoon',
}

export enum MeasureUnitLabelEnum {
  gram = 'Gram', // g
  kilogram = 'Kilogram', // kg
  milliliter = 'Milliliter', // ml
  centiliter = 'Centiliter', // cl
  liter = 'Liter', // l
  tablespoon = 'Tablespoon', // c-à-s
  teaspoon = 'Teaspoon', // c-à-c
}

export const MeasureUnits = EnumHelper.enumToAssociativArray(MeasureUnitLabelEnum);

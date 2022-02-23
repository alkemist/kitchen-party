import { EnumHelper } from '../tools';

export enum MeasureUnitEnum {
  gram = 'Gram', // g
  kilogram = 'Kilogram', // kg
  milliliter = 'Milliliter', // ml
  centiliter = 'Centiliter', // cl
  liter = 'Liter', // l
  tablespoon = 'Tablespoon', // c-à-s
  teaspoon = 'Teaspoon', // c-à-c
}

export const MeasureUnits = EnumHelper.enumToAssociativArray(MeasureUnitEnum);

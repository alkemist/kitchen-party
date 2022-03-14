import { EnumHelper } from '@tools';

export enum DietTypeKeyEnum {
  vege = 'vege',
  vegan = 'vegan',
  meat = 'meat',
  fish = 'fish',
}

export enum DietTypeLabelEnum {
  vege = 'Vegetarian', // Végétarien
  vegan = 'Vegan', // Végan
  meat = 'Meat', // Végan
  fish = 'Fish', // Végan
}

export const DietTypes = EnumHelper.enumToMap(DietTypeLabelEnum);

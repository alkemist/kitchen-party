import {EnumHelper} from '../tools/enum.helper';

export enum DietTypeEnum {
  vege = 'Vegetarian', // Végétarien
  vegan = 'Vegan', // Végan
  meat = 'Meat', // Végan
  fish = 'Fish', // Végan
}

export const DietTypes = EnumHelper.enumToAssociativArray(DietTypeEnum);

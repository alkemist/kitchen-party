import { EnumHelper } from '../tools';

export enum SweetSaltyEnum {
  sweet = 'Sweet', // Sucré
  salty = 'Salty', // Salé
}

export const SweetSalty = EnumHelper.enumToAssociativArray(SweetSaltyEnum);

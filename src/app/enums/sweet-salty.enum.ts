import { EnumHelper } from '@tools';

export enum SweetSaltyKeyEnum {
  sweet = 'sweet',
  salty = 'salty',
}

export enum SweetSaltyLabelEnum {
  sweet = 'Sweet', // Sucré
  salty = 'Salty', // Salé
}

export const SweetSalty = EnumHelper.enumToMap(SweetSaltyLabelEnum);

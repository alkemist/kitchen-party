import {EnumHelper} from '../tools/enum.helper';

export enum SweetSaltyEnum {
  sweet = 'Sweet', // Sucré
  salty = 'Salty', // Salé
}

export const SweetSalty = EnumHelper.enumToAssociativArray(SweetSaltyEnum);

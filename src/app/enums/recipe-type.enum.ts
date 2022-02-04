import {EnumHelper} from '../tools/enum.helper';

export enum RecipeTypeEnum {
  soup = 'Soup', // Soupe
  cake = 'Cake', // Cake
  risotto = 'Risotto', // Risotto
  pasta = 'Pasta', // Pâtes
  pie = 'Pie', // Tarte
  quiche = 'Quiche', // Quiche
  pizza = 'Pizza', // Pizza
  gratin = 'Gratin', // Gratin
  mash = 'Mash', // Purée
  sauce = 'Sauce', // Sauce
  burger = 'Burger', // Burger
  ingredient = 'Ingredient' // Ingrédient
}

export const RecipeTypes = EnumHelper.enumToAssociativArray(RecipeTypeEnum);

import { EnumHelper } from '../tools';

export enum RecipeTypeKeyEnum {
  soup = 'soup',
  cake = 'cake',
  risotto = 'risotto',
  pasta = 'pasta',
  pie = 'pie',
  quiche = 'quiche',
  pizza = 'pizza',
  gratin = 'gratin',
  mash = 'mash',
  sauce = 'sauce',
  burger = 'burger',
  ingredient = 'ingredient',
}

export enum RecipeTypeLabelEnum {
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

export const RecipeTypes = EnumHelper.enumToMap(RecipeTypeLabelEnum);

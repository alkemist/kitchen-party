import { EnumHelper } from '../tools/enum.helper';

export enum IngredientTypeEnum {
  meats = 'Meats', // Viandes
  fishes_seafoods = 'Fishes and seafoods', // Poissons et fruits de mer
  fruits_vegetables_mushrooms = 'Fruits, vegetables and mushrooms', // Fruits, légumes et champignons
  cereals_legumines = 'Cereals and legumines', // Céréales et légumineuses
  animal_fats = 'Animal fats', // Matières grasses animales
  vegetable_fats = 'Vegetable fats', // matières grasses végétales
  yeasts = 'Yeasts', // Levures
  aromatic_herbs = 'Aromatic herbs', // Herbes aromatiques
  alcohols = 'Alcohols', // Alcools
  water = 'Water', // Eau
  spices = 'Spices', // Épices
  sugars = 'Sugars', // Sucres
  salts = 'Salts', // Sels
}

export const IngredientTypes = EnumHelper.enumToAssociativArray(IngredientTypeEnum);

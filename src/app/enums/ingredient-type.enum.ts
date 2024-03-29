import { EnumHelper } from '@tools';

export enum IngredientTypeKeyEnum {
  meats = 'meats',
  fishes_seafoods = 'fishes_seafoods',
  fruits_vegetables_mushrooms = 'fruits_vegetables_mushrooms',
  cereals_legumines = 'cereals_legumines',
  animal_fats = 'animal_fats',
  vegetable_fats = 'vegetable_fats',
  yeasts = 'yeasts',
  aromatic_herbs = 'aromatic_herbs',
  alcohols = 'alcohols',
  water = 'water',
  spices = 'spices',
  sugars = 'sugars',
  salts = 'salts',
}

export enum IngredientTypeLabelEnum {
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

export enum IngredientTypeIconEnum {
  meats = 'goat',
  fishes_seafoods = 'directions_boat',
  fruits_vegetables_mushrooms = 'local_florist',
  cereals_legumines = 'grass',
  animal_fats = 'opacity',
  vegetable_fats = 'opacity',
  yeasts = 'bubble_chart',
  aromatic_herbs = 'eco',
  alcohols = 'liquor',
  water = 'local_drink',
  spices = 'bolt',
  sugars = 'view_comfortable',
  salts = 'grain',
}


export const IngredientTypes = EnumHelper.enumToMap(IngredientTypeLabelEnum);

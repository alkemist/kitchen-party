import { IngredientModel } from '../models/ingredient.model';

export interface MonthCalendarInterface {
  name: string,
  ingredients: (IngredientModel | null)[],
}
import { IngredientModel } from '@models';

export interface MonthCalendarInterface {
  name: string,
  ingredients: (IngredientModel | null)[],
}

import { IngredientTypeKeyEnum } from '@enums';

export const ingredientTypeMeatMap: Map<IngredientTypeKeyEnum, boolean> = new Map<IngredientTypeKeyEnum, boolean>(
  [
    [ IngredientTypeKeyEnum.meats, true ],
    [ IngredientTypeKeyEnum.fishes_seafoods, false ],
    [ IngredientTypeKeyEnum.fruits_vegetables_mushrooms, false ],
    [ IngredientTypeKeyEnum.cereals_legumines, false ],
    [ IngredientTypeKeyEnum.animal_fats, false ],
    [ IngredientTypeKeyEnum.vegetable_fats, false ],
    [ IngredientTypeKeyEnum.yeasts, false ],
    [ IngredientTypeKeyEnum.aromatic_herbs, false ],
    [ IngredientTypeKeyEnum.alcohols, false ],
    [ IngredientTypeKeyEnum.water, false ],
    [ IngredientTypeKeyEnum.spices, false ],
    [ IngredientTypeKeyEnum.sugars, false ],
    [ IngredientTypeKeyEnum.salts, false ],
  ]
);

export const ingredientTypeFishMap: Map<IngredientTypeKeyEnum, boolean> = new Map<IngredientTypeKeyEnum, boolean>(
  [
    [ IngredientTypeKeyEnum.meats, false ],
    [ IngredientTypeKeyEnum.fishes_seafoods, true ],
    [ IngredientTypeKeyEnum.fruits_vegetables_mushrooms, false ],
    [ IngredientTypeKeyEnum.cereals_legumines, false ],
    [ IngredientTypeKeyEnum.animal_fats, false ],
    [ IngredientTypeKeyEnum.vegetable_fats, false ],
    [ IngredientTypeKeyEnum.yeasts, false ],
    [ IngredientTypeKeyEnum.aromatic_herbs, false ],
    [ IngredientTypeKeyEnum.alcohols, false ],
    [ IngredientTypeKeyEnum.water, false ],
    [ IngredientTypeKeyEnum.spices, false ],
    [ IngredientTypeKeyEnum.sugars, false ],
    [ IngredientTypeKeyEnum.salts, false ],
  ]
);

export const ingredientTypeVegeMap: Map<IngredientTypeKeyEnum, boolean> = new Map<IngredientTypeKeyEnum, boolean>(
  [
    [ IngredientTypeKeyEnum.meats, false ],
    [ IngredientTypeKeyEnum.fishes_seafoods, false ],
    [ IngredientTypeKeyEnum.fruits_vegetables_mushrooms, true ],
    [ IngredientTypeKeyEnum.cereals_legumines, true ],
    [ IngredientTypeKeyEnum.animal_fats, true ],
    [ IngredientTypeKeyEnum.vegetable_fats, true ],
    [ IngredientTypeKeyEnum.yeasts, true ],
    [ IngredientTypeKeyEnum.aromatic_herbs, true ],
    [ IngredientTypeKeyEnum.alcohols, true ],
    [ IngredientTypeKeyEnum.water, true ],
    [ IngredientTypeKeyEnum.spices, true ],
    [ IngredientTypeKeyEnum.sugars, true ],
    [ IngredientTypeKeyEnum.salts, true ],
  ]
);

export const ingredientTypeVeganMap: Map<IngredientTypeKeyEnum, boolean> = new Map<IngredientTypeKeyEnum, boolean>(
  [
    [ IngredientTypeKeyEnum.meats, false ],
    [ IngredientTypeKeyEnum.fishes_seafoods, false ],
    [ IngredientTypeKeyEnum.fruits_vegetables_mushrooms, true ],
    [ IngredientTypeKeyEnum.cereals_legumines, true ],
    [ IngredientTypeKeyEnum.animal_fats, false ],
    [ IngredientTypeKeyEnum.vegetable_fats, true ],
    [ IngredientTypeKeyEnum.yeasts, true ],
    [ IngredientTypeKeyEnum.aromatic_herbs, true ],
    [ IngredientTypeKeyEnum.alcohols, true ],
    [ IngredientTypeKeyEnum.water, true ],
    [ IngredientTypeKeyEnum.spices, true ],
    [ IngredientTypeKeyEnum.sugars, true ],
    [ IngredientTypeKeyEnum.salts, true ],
  ]
);
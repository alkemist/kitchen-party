import { RecipeV2FrontInterface } from '@app/interfaces/recipe.interface';
import { RecipeIngredientFormInterface } from '@app/interfaces/recipe-ingredient-form.interface';

export interface RecipeFormInterface extends RecipeV2FrontInterface {
  recipeIngredientForms: RecipeIngredientFormInterface[];
}

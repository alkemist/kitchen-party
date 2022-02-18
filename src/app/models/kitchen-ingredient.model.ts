import { KitchenIngredientInterface } from '../interfaces/kitchen-ingredient.interface';
import { RecipeIngredientModel } from './recipe-ingredient.model';


export class KitchenIngredientModel extends RecipeIngredientModel implements KitchenIngredientInterface {
  slug?: string = '';

  constructor(kitchenIngredient: KitchenIngredientInterface) {
    super(kitchenIngredient);
    this.slug = kitchenIngredient.slug;
  }

  get name(): string | undefined {
    return this.ingredient?.name;
  }

}




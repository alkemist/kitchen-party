import {KitchenIngredientInterface} from '@interfaces';
import {RelationIngredientModel} from "./relation-ingredient.model";


export class KitchenIngredientModel extends RelationIngredientModel implements KitchenIngredientInterface {
  slug?: string = '';

  constructor(kitchenIngredient: KitchenIngredientInterface) {
    super(kitchenIngredient);
    this.slug = kitchenIngredient.slug ?? '';
  }

  get name(): string | undefined {
    return this.ingredient?.name;
  }

}




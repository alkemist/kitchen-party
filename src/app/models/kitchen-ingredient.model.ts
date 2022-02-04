import {FirestoreDataConverter} from "@firebase/firestore";
import {DocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import {RecipeIngredientInterface, RecipeIngredientModel} from "./recipe-ingredient.model";

export interface KitchenIngredientInterface extends RecipeIngredientInterface {
  slug?: string;
}

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

export const kitchenIngredientConverter: FirestoreDataConverter<KitchenIngredientModel> = {
  toFirestore: (kitchenIngredient: KitchenIngredientModel) => {
    const kitchenIngredientFields = {...kitchenIngredient};
    delete kitchenIngredientFields.id;

    kitchenIngredientFields.ingredientId = kitchenIngredientFields.ingredient?.id! || '';
    delete kitchenIngredientFields.ingredient;

    kitchenIngredientFields.recipeId = kitchenIngredientFields.recipe?.id! || '';
    delete kitchenIngredientFields.recipe;

    return kitchenIngredientFields;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return new KitchenIngredientModel(data as KitchenIngredientInterface);
  }
};


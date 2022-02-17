import {FirestoreDataConverter} from "@firebase/firestore";
import {DocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import {KitchenIngredientModel} from "../models/kitchen-ingredient.model";
import {KitchenIngredientInterface} from "../interfaces/kitchen-ingredient.interface";

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
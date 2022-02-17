import {FirestoreDataConverter} from "@firebase/firestore";
import {IngredientInterface} from "../interfaces/ingredient.interface";
import {DocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import {IngredientModel} from "../models/ingredient.model";

export const ingredientConverter: FirestoreDataConverter<IngredientInterface> = {
  toFirestore: (ingredient: IngredientModel): IngredientInterface => {
    const ingredientFields = {...ingredient};
    ingredientFields.recipeId = ingredientFields.recipe ? ingredientFields.recipe?.id : '';
    if (!ingredientFields.monthBegin) {
      ingredientFields.monthBegin = null;
    }
    if (!ingredientFields.monthEnd) {
      ingredientFields.monthEnd = null;
    }

    delete ingredientFields.id;
    delete ingredientFields.recipe;
    return ingredientFields;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    return snapshot.data(options) as IngredientInterface;
  }
};

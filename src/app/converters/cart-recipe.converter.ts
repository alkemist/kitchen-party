import {FirestoreDataConverter} from '@firebase/firestore';
import {CartRecipeInterface} from '@interfaces';
import {CartRecipeModel} from '@models';
import {DocumentSnapshot, SnapshotOptions} from 'firebase/firestore';

export const cartRecipeConverter: FirestoreDataConverter<CartRecipeModel> = {
  toFirestore: (cartRecipe: CartRecipeModel) => {
    const cartRecipeFields = {...cartRecipe};
    delete cartRecipeFields.id;

    cartRecipeFields.recipeId = cartRecipeFields.recipe?.id! || '';
    delete cartRecipeFields.recipeId;

    return cartRecipeFields;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return new CartRecipeModel(data as CartRecipeInterface);
  }
};

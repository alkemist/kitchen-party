import {FirestoreDataConverter} from '@firebase/firestore';
import {CartIngredientInterface} from '@interfaces';
import {CartIngredientModel} from '@models';
import {DocumentSnapshot, SnapshotOptions} from 'firebase/firestore';

export const cartIngredientConverter: FirestoreDataConverter<CartIngredientModel> = {
  toFirestore: (cartIngredient: CartIngredientModel) => {
    const cartIngredientFields = {...cartIngredient};
    delete cartIngredientFields.id;

    cartIngredientFields.ingredientId = cartIngredientFields.ingredient?.id! || '';
    delete cartIngredientFields.ingredient;

    return cartIngredientFields;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return new CartIngredientModel(data as CartIngredientInterface);
  }
};

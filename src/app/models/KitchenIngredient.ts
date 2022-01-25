import {FirestoreDataConverter} from '@firebase/firestore';
import {DocumentSnapshot, SnapshotOptions, WithFieldValue} from 'firebase/firestore';
import {MeasureUnit} from '../enums/MeasureUnit';
import {IngredientModel} from './ingredient.model';

export interface KitchenIngredientInterface {
  id?: string,
  quantity?: number,
  measure?: string,
  unit?: MeasureUnit | null,

  ingredient?: IngredientModel,
  ingredientId?: string,
}

export class KitchenIngredient implements KitchenIngredientInterface {
  id?: string;
  quantity: number;
  measure: string;
  unit: MeasureUnit | null;

  ingredient?: IngredientModel;
  ingredientId?: string;

  constructor(kitchenIngredient: KitchenIngredientInterface) {
    this.id = kitchenIngredient.id;
    this.quantity = kitchenIngredient.quantity || 1;
    this.measure = kitchenIngredient.measure || '';
    this.unit = kitchenIngredient.unit || null;

    this.ingredient = kitchenIngredient.ingredient;
    this.ingredientId = kitchenIngredient.ingredientId;
  }

  getEquivalentGram(): number {
    return 0;
  }
}

export const kitchenIngredientConverter: FirestoreDataConverter<KitchenIngredient> = {
  toFirestore: (kitchenIngredient: WithFieldValue<KitchenIngredient>) => {
    const kitchenIngredientFields = {...kitchenIngredient};
    delete kitchenIngredientFields.id;
    return kitchenIngredientFields;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return new KitchenIngredient(data as KitchenIngredientInterface);
  }
};

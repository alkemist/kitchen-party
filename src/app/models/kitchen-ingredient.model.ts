import {FirestoreDataConverter} from '@firebase/firestore';
import {DocumentSnapshot, SnapshotOptions, WithFieldValue} from 'firebase/firestore';
import {MeasureUnitEnum} from '../enums/measure-unit.enum';
import {IngredientModel} from './ingredient.model';

export interface KitchenIngredientInterface {
  id?: string,
  quantity?: number,
  measure?: string,
  unit?: MeasureUnitEnum | null,

  ingredient?: IngredientModel,
  ingredientId?: string,
}

export class KitchenIngredientModel implements KitchenIngredientInterface {
  id?: string;
  quantity: number;
  measure: string;
  unit: MeasureUnitEnum | null;

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

export const kitchenIngredientConverter: FirestoreDataConverter<KitchenIngredientModel> = {
  toFirestore: (kitchenIngredient: WithFieldValue<KitchenIngredientModel>) => {
    const kitchenIngredientFields = {...kitchenIngredient};
    delete kitchenIngredientFields.id;
    return kitchenIngredientFields;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return new KitchenIngredientModel(data as KitchenIngredientInterface);
  }
};

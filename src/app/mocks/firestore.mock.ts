import { FirestoreDataConverter } from '@firebase/firestore';
import { DataObjectInterface } from '../interfaces';

export const dummyConverter: FirestoreDataConverter<DataObjectInterface> = {
  toFirestore: (object: any): DataObjectInterface => {
    return object;
  },
  fromFirestore: () => {
    return {};
  }
};

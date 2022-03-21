import { FirestoreDataConverter } from '@firebase/firestore';
import { DataObjectInterface } from '@interfaces';

export abstract class MockHelper {
  static prepareInterfaces<T extends U, U extends DataObjectInterface>(model: T, converter: FirestoreDataConverter<U>): DataObjectInterface {
    const id = model.id;
    const converted = converter.toFirestore(model);
    (converted as DataObjectInterface).id = id;
    return converted;
  }
}
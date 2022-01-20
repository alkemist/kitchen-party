import {FirestoreDataConverter} from '@firebase/firestore';
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  QueryConstraint,
  setDoc,
  where,
} from 'firebase/firestore';
import {generatePushID} from '../tools/generate-pushid';

interface Document {
  id?: string;
}

export class DocumentNotFound<T extends Document> extends Error {
  private readonly collectionName: string;

  constructor(collectionName: string, document?: T) {
    super();
    this.collectionName = collectionName;
    this.message = `Document "${this.collectionName}" not found ${document ? `with id ${document.id}` : ''}`;
  }
}

export class TooManyRequestError extends Error {
  override message = 'Too many request';
}

export class OfflineError extends Error {
  override message = 'You are offline';
}

export abstract class FirestoreService<T extends Document> {
  private readonly collectionName: string;
  private readonly converter: FirestoreDataConverter<T>;
  private readonly ref: CollectionReference;

  protected constructor(collectionName: string, converter: FirestoreDataConverter<T>) {
    this.collectionName = collectionName;
    this.converter = converter;
    this.ref = collection(getFirestore(), collectionName);
  }

  protected async list(...queryConstraints: QueryConstraint[]): Promise<T[]> {
    const q = query(this.ref, ...queryConstraints).withConverter(this.converter);
    const querySnapshot = await getDocs(q);
    const documents: T[] = [];

    querySnapshot.forEach((doc) => {
      const document = doc.data();
      document.id = doc.id;
      documents.push(document);
    });

    return documents;
  }

  protected async findOneById(id: string): Promise<T> {
    const ref = doc(this.ref, id).withConverter(this.converter);
    const docSnapshot = await getDoc(ref);
    const document = docSnapshot.data();

    if (!document) {
      throw new DocumentNotFound<T>(this.collectionName);
    }
    document.id = docSnapshot.id;

    return document;
  }

  protected async findOneBySlug(slug: string): Promise<T> {
    const list = await this.list(where('slug', '==', slug));

    if (list.length === 0) {
      throw new DocumentNotFound<T>(this.collectionName);
    }

    return list[0];
  }

  protected async addOne(document: T): Promise<T> {
    const id = generatePushID();
    const ref = doc(this.ref, id).withConverter(this.converter);
    await setDoc(ref, document);
    return {...document, id: id};
  }

  protected async updateOne(document: T): Promise<void> {
    if (!document.id) {
      throw new DocumentNotFound<T>(this.collectionName, document);
    }

    const ref = doc(this.ref, document.id).withConverter(this.converter);
    return setDoc(ref, document);
  }

  protected async deleteOne(document: T): Promise<void> {
    if (!document.id) {
      throw new DocumentNotFound<T>(this.collectionName, document);
    }

    const ref = doc(this.ref, document.id).withConverter(this.converter);
    return deleteDoc(ref);
  }
}

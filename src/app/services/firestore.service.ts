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
import {Observable} from 'rxjs';
import {generatePushID} from '../tools/generate-pushid';
import {slugify} from '../tools/slugify';
import {LoggedError, LoggerService} from './logger.service';

export interface DataObject {
  id?: string;
  name?: string;
  slug?: string;
}

export class DocumentNotFound<T extends DataObject> extends Error {
  private readonly collectionName: string;

  constructor(collectionName: string, document?: T) {
    super();
    this.collectionName = collectionName;
    this.message = `Document ["${this.collectionName}"] not found ${document ? `with id ${document.id}` : ''}`;
  }
}

export class EmptyDocument<T extends DataObject> extends Error {
  private readonly collectionName: string;

  constructor(collectionName: string) {
    super();
    this.collectionName = collectionName;
    this.message = `Document ["${this.collectionName}"] is empty`;
  }
}

export class TooManyRequestError extends LoggedError<any> {
  override type = 'Database';
  override message = 'Too many request';
}

export class QuotaExceededError extends LoggedError<any> {
  override type = 'Database';
  override message = 'Quota exceeded';
}

export class OfflineError extends Error {
  override message = 'You are offline';
}

export class DatabaseError extends LoggedError<DataObject> {
  override type = 'Database';

  constructor(public override message: string, public override context: DataObject) {
    super();
  }
}

export abstract class FirestoreService<T extends DataObject> {
  protected lastUpdated$?: Observable<Date>;
  protected all$?: Observable<T[]>;
  protected lastUpdated?: Date;
  /**
   * True : La liste a été mis à jour
   * False : la liste n'a pas été encore mis à jour
   * @protected
   */
  protected refreshed = false;
  /**
   * True : Un élément a été modifié, la liste doit être mise à jour
   * False : La liste est synchronisé
   * @protected
   */
  protected synchronized = false;
  protected promise: Promise<T[]> | null = null;

  private readonly collectionName: string;
  private readonly converter: FirestoreDataConverter<T>;
  private readonly ref: CollectionReference;
  private readonly loggerService: LoggerService;

  protected constructor(logger: LoggerService, collectionName: string, converter: FirestoreDataConverter<T>) {
    this.loggerService = logger;
    this.collectionName = collectionName;
    this.converter = converter;
    this.ref = collection(getFirestore(), collectionName);
    this.lastUpdated$?.subscribe(lastUpdated => {
      this.lastUpdated = lastUpdated;
    });
  }

  storeIsOutdated() {
    if (this.lastUpdated === undefined) {
      return true;
    }
    const dateTime = new Date().getTime();
    const lastUpdatedTime = new Date(this.lastUpdated).getTime();
    const nbHours = (dateTime - lastUpdatedTime) / (1000 * 60 * 60);
    return nbHours > 24;
  }

  public async exist(name: string): Promise<boolean> {
    if (!name) {
      return false;
    }

    const slug = slugify(name);
    let dataObjectDocument = null;
    try {
      dataObjectDocument = await this.findOneBySlug(slug);
    } catch (e) {
      if (!(e instanceof DocumentNotFound)) {
        this.loggerService.error(new DatabaseError((e as Error).message, {slug}))
      }
    }
    return !!dataObjectDocument;
  }

  protected async select(...queryConstraints: QueryConstraint[]): Promise<T[]> {
    if (!this.promise) {
      this.promise = this.refresh(...queryConstraints);
    }

    return new Promise<T[]>(resolve => {
      this.promise?.then(documents => {
        this.promise = null;
        resolve(documents);
      });
    });
  }

  protected async findOneById(id: string): Promise<T> {
    let docSnapshot;
    try {
      const ref = doc(this.ref, id).withConverter(this.converter);
      docSnapshot = await getDoc(ref);
    } catch (error) {
      this.loggerService.error(new DatabaseError((error as Error).message, {id}));
    }

    if (!docSnapshot) {
      throw new DocumentNotFound<T>(this.collectionName);
    }

    const document = docSnapshot.data();

    if (!document) {
      throw new DocumentNotFound<T>(this.collectionName);
    }
    document.id = docSnapshot.id;

    return document;
  }

  protected async findOneBySlug(slug: string): Promise<T> {
    const list = await this.select(where('slug', '==', slug));

    if (list.length === 0) {
      throw new DocumentNotFound<T>(this.collectionName);
    }

    return list[0];
  }

  protected async addOne(document: T): Promise<T> {
    const id = generatePushID();
    this.updateSlug(document);

    try {
      const ref = doc(this.ref, id).withConverter(this.converter);
      await setDoc(ref, document);
      this.synchronized = false;
    } catch (error) {
      this.loggerService.error(new DatabaseError((error as Error).message, document));
    }
    return await this.findOneById(id);
  }

  protected async updateOne(document: T): Promise<T> {
    if (!document.id) {
      throw new DocumentNotFound<T>(this.collectionName, document);
    }
    this.updateSlug(document);

    try {
      const ref = doc(this.ref, document.id).withConverter(this.converter);
      await setDoc(ref, document);
      this.synchronized = false;
    } catch (error) {
      this.loggerService.error(new DatabaseError((error as Error).message, document));
    }
    return await this.findOneById(document.id);
  }

  protected async removeOne(document: T): Promise<void> {
    if (!document.id) {
      throw new DocumentNotFound<T>(this.collectionName, document);
    }

    try {
      const ref = doc(this.ref, document.id).withConverter(this.converter);
      await deleteDoc(ref);
      this.synchronized = false;
    } catch (error) {
      this.loggerService.error(new DatabaseError((error as Error).message, document));
    }
  }

  private async refresh(...queryConstraints: QueryConstraint[]): Promise<T[]> {
    const q = query(this.ref, ...queryConstraints).withConverter(this.converter);
    const documents: T[] = [];
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const document = doc.data();
        document.id = doc.id;
        documents.push(document);
      });
    } catch (e) {
      const er = e as Error;
      if (er.message === 'Quota exceeded.') {
        this.loggerService.error(new QuotaExceededError());
      }
    }
    this.refreshed = true;
    return documents;
  }

  private updateSlug(document: T) {
    if (!document.name) {
      throw new EmptyDocument(this.collectionName);
    }

    document.slug = slugify(document.name);
  }
}

import { DataObjectInterface } from '../../interfaces';

export class EmptyDocumentError<T extends DataObjectInterface> extends Error {
  private readonly collectionName: string;

  constructor(collectionName: string) {
    super();
    this.collectionName = collectionName;
    this.message = `Document ["${ this.collectionName }"] is empty`;
  }
}

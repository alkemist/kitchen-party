import {IdentifiableInterface} from './Identifiable';

export interface FamilyInterface  extends IdentifiableInterface {
  familyId?: number;
  name: string;
}

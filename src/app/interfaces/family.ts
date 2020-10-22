import {IdentifiableInterface} from './Identifiable';

export interface FamilyInterface  extends IdentifiableInterface {
  familyId?: number;
  family?: FamilyInterface;
  name: string;
}

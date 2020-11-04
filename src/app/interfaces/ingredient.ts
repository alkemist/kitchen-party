import {FamilyInterface} from './family';
import {IdentifiableInterface} from './Identifiable';

export interface IngredientInterface  extends IdentifiableInterface {
  name: string;
  familyId?: number;
  family?: FamilyInterface;
}

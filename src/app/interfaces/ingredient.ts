import {FamilyInterface} from './family';
import {IdentifiableInterface} from './Identifiable';

export interface IngredientInterface  extends IdentifiableInterface {
  name: number;
  familyId?: number;
  family?: FamilyInterface;
}

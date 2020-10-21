import {MeasureTypeEnum} from '../enums/measureType';
import {FamilyInterface} from './family';
import {IdentifiableInterface} from './Identifiable';

export interface MeasureInterface extends IdentifiableInterface  {
  name: string;
  type: MeasureTypeEnum;
  quantity: number;
  measureId?: number;
  measure?: MeasureInterface;
  family?: FamilyInterface;
}

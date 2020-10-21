import {MatterEnum} from '../enums/matter';
import {MeasureInterface} from './measure';
import {IdentifiableInterface} from './Identifiable';

export interface ToolInterface extends IdentifiableInterface {
  name: string;
  matter?: MatterEnum;
  measureId?: number;
  measure?: MeasureInterface;
}

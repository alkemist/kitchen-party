import {ActionInterface} from './action';
import {MeasureInterface} from './measure';
import {IngredientInterface} from './ingredient';
import {ToolInterface} from './tool';
import {IdentifiableInterface} from './Identifiable';
import {SortableInterface} from './sortable';

export interface OperationInterface extends IdentifiableInterface  {
  name: string;
  order?: number;
  description?: string;
  timing?: string;
  actionId: number;
  action: ActionInterface;

  measureIngredientIds: number[];
  measureIngredients: MeasureIngredientInterface[];
  measureToolIds: number[];
  measureTools: MeasureToolInterface[];
  measureOperationIds: number[];
  measureOperations: MeasureOperationInterface[];
}

export interface MeasureIngredientInterface extends IdentifiableInterface, SortableInterface {
  quantity?: number;
  measureId?: number;
  measure?: MeasureInterface;
  ingredientId: number;
  ingredient: IngredientInterface;
}

export interface MeasureToolInterface extends IdentifiableInterface, SortableInterface {
  quantity?: number;
  measureId?: number;
  measure?: MeasureInterface;
  toolId: number;
  tool: ToolInterface;
}

export interface MeasureOperationInterface extends IdentifiableInterface, SortableInterface {
  quantity?: number;
  measureId?: number;
  measure?: MeasureInterface;
  operationId: number;
  operation: OperationInterface;
}

import {ActionInterface} from './action';
import {MeasureInterface} from './measure';
import {IngredientInterface} from './ingredient';
import {ToolInterface} from './tool';
import {IdentifiableInterface} from './Identifiable';

export interface OperationInterface extends IdentifiableInterface  {
  name?: string;
  order?: number;
  description?: string;
  timing?: string;
  result?: string;
  actionId: number;
  action: ActionInterface;
  measureId?: number;
  measure?: MeasureInterface;

  measureIngredientIds: number[];
  measureIngredients: MeasureIngredientInterface[];
  measureToolIds: number[];
  measureTools: MeasureToolInterface[];
  measureOperationIds: number[];
  measureOperations: MeasureOperationInterface[];
}

export interface OperationMeasureIngredientInterface extends IdentifiableInterface {
  order: number;
  operation_id: number;
  operation: OperationInterface;
  measureIngredientId: number;
  measureIngredient: MeasureIngredientInterface;
}

export interface MeasureIngredientInterface extends IdentifiableInterface {
  quantity?: number;
  measureId?: number;
  measure?: MeasureInterface;
  ingredientId: number;
  ingredient: IngredientInterface;
}

export interface OperationMeasureToolInterface  extends IdentifiableInterface {
  order: number;
  operation_id: number;
  operation: OperationInterface;
  measureToolId: number;
  measureTool: MeasureToolInterface;
}

export interface MeasureToolInterface {
  quantity?: number;
  measureId?: number;
  measure?: MeasureInterface;
  toolId: number;
  tool: ToolInterface;
}

export interface OperationMeasureOperationInterface extends IdentifiableInterface {
  order: number;
  operation_id: number;
  operation: OperationInterface;
  measureOperationId: number;
  measureOperation: MeasureOperationInterface;
}

export interface MeasureOperationInterface extends IdentifiableInterface {
  quantity?: number;
  measureId?: number;
  measure?: MeasureInterface;
  operationId: number;
  operation: OperationInterface;
}

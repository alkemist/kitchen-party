import {RecipeTypeEnum} from '../enums/recipeType';
import {OperationInterface} from './operation';
import {IdentifiableInterface} from './Identifiable';

export interface RecipeInterface extends IdentifiableInterface {
  name: string;
  duration: number;
  peoples: number;
  type: RecipeTypeEnum;
  complexity: number;
  price: number;
  operationIds: number[];
  operations: RecipeOperationInterface[];
}

export interface RecipeOperationInterface extends IdentifiableInterface {
  order: number;
  recipeId: number;
  recipe: RecipeInterface;
  operationId: number;
  operation: OperationInterface;
}

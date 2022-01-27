import {FirestoreDataConverter} from '@firebase/firestore';
import {DocumentSnapshot, SnapshotOptions} from 'firebase/firestore';
import {IngredientTypeEnum} from '../enums/ingredient-type.enum';
import {DataObject} from '../services/firestore.service';
import {RecipeModel} from './recipe.model';


export interface IngredientInterface extends DataObject {
  id?: string,
  name: string,
  slug: string,

  type: IngredientTypeEnum,
  isLiquid?: boolean | null,

  recipeId?: string,
  recipe?: RecipeModel
}

export class IngredientModel implements IngredientInterface {
  id?: string;
  name: string;
  slug: string;

  type: IngredientTypeEnum;
  isLiquid: boolean | null;

  recipeId?: string;
  recipe?: RecipeModel;

  constructor(ingredient: IngredientInterface) {
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.slug = ingredient.slug;
    this.type = ingredient.type;
    this.isLiquid = ingredient.isLiquid || null;
  }

  get typeName(): string {
    return this.type.charAt(0).toUpperCase() + this.type.slice(1);
  }

  hydrate(ingredient: IngredientInterface) {
    this.name = ingredient.name;
    this.slug = ingredient.slug;
    this.type = ingredient.type;
    this.isLiquid = ingredient.isLiquid || null;
  }

  isVege(): boolean {
    return false;
  }

  isVegan(): boolean {
    return false;
  }

  isMeat(): boolean {
    return false;
  }

  isFish(): boolean {
    return false;
  }

  isSweet(): boolean {
    return false;
  }

  isSalty(): boolean {
    return false;
  }
}

export const ingredientConverter: FirestoreDataConverter<IngredientModel> = {
  toFirestore: (ingredient: IngredientModel): IngredientInterface => {
    const ingredientFields = {...ingredient};
    ingredientFields.recipeId = ingredientFields.recipe ? ingredientFields.recipe?.id : '';
    delete ingredientFields.id;
    delete ingredientFields.recipe;
    return ingredientFields;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return new IngredientModel(data as IngredientInterface);
  }
};

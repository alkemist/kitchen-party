import {FirestoreDataConverter} from '@firebase/firestore';
import {DocumentSnapshot, SnapshotOptions} from 'firebase/firestore';
import {IngredientType} from '../enums/IngredientType';
import {Recipe} from './Recipe';


export interface IngredientInterface {
  id?: string,
  name: string,
  slug: string,

  type: IngredientType,
  isLiquid?: boolean | null,

  recipeId?: string,
  recipe?: Recipe
}

export class Ingredient implements IngredientInterface {
  id?: string;
  name: string;
  slug: string;

  type: IngredientType;
  isLiquid: boolean | null;

  recipeId?: string;
  recipe?: Recipe;

  constructor(ingredient: IngredientInterface) {
    this.id = ingredient.id;
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

export const ingredientConverter: FirestoreDataConverter<Ingredient> = {
  toFirestore: (ingredient: Ingredient): IngredientInterface => {
    const ingredientFields = {...ingredient};
    ingredientFields.recipeId = ingredientFields.recipe?.id;
    delete ingredientFields.id;
    delete ingredientFields.recipe;
    return ingredientFields;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    return new Ingredient(data as IngredientInterface);
  }
};

import {FirestoreDataConverter} from '@firebase/firestore';
import {DocumentSnapshot, SnapshotOptions} from 'firebase/firestore';
import {RecipeType} from '../enums/RecipeType';
import {DataObject} from '../services/firestore.service';
import {RecipeIngredient, RecipeIngredientInterface} from './RecipeIngredient';

export interface RecipeInterface extends DataObject {
  id?: string,
  name: string,
  slug: string,

  cookingDuration?: number,
  preparationDuration?: number,
  waitingDuration?: number,

  nbSlices?: number,
  instructions?: string[],
  type?: RecipeType | null,
  image?: string,
  source?: string,

  recipeIngredients: RecipeIngredientInterface[],
}

export class Recipe {
  id?: string;
  name: string;
  slug: string;

  cookingDuration?: number;
  preparationDuration?: number;
  waitingDuration?: number;

  nbSlices?: number;
  instructions?: string[];
  type?: RecipeType | null;
  image?: string;
  source?: string;

  recipeIngredients: RecipeIngredient[] = [];

  constructor(recipe: RecipeInterface) {
    this.id = recipe.id;
    this.name = recipe.name;
    this.slug = recipe.slug;

    this.cookingDuration = recipe.cookingDuration;
    this.preparationDuration = recipe.preparationDuration;
    this.waitingDuration = recipe.waitingDuration;

    this.nbSlices = recipe.nbSlices;
    this.instructions = recipe.instructions || [];
    this.type = recipe.type || null;
    this.image = recipe.image;
    this.source = recipe.source;

    this.recipeIngredients =
      recipe.recipeIngredients.map(recipeIngredient => new RecipeIngredient(recipeIngredient));
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

export const recipeConverter: FirestoreDataConverter<Recipe> = {
  toFirestore: (recipe: Recipe): RecipeInterface => {
    const recipeFields = {...recipe} as RecipeInterface;
    delete recipeFields.id;
    recipeFields.recipeIngredients = [];

    recipe.recipeIngredients.forEach(recipeIngredient => {
      const recipeIngredientField = {...recipeIngredient};
      delete recipeIngredientField.id;

      recipeIngredientField.ingredientId = recipeIngredient.ingredient?.id!;
      delete recipeIngredientField.ingredient;

      recipeFields.recipeIngredients.push({
        ...recipeIngredientField
      });
    });

    return recipeFields;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const recipeData = snapshot.data(options) as RecipeInterface;
    return new Recipe(recipeData);
  }
};


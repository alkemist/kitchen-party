import {FirestoreDataConverter} from '@firebase/firestore';
import {DocumentSnapshot, SnapshotOptions} from 'firebase/firestore';
import {RecipeTypeEnum} from '../enums/recipe-type.enum';
import {DataObject} from '../services/firestore.service';
import {RecipeIngredientInterface, RecipeIngredientModel} from './recipe-ingredient.model';

export interface RecipeInterface extends DataObject {
  id?: string,
  name: string,
  slug: string,

  cookingDuration?: number,
  preparationDuration?: number,
  waitingDuration?: number,

  nbSlices?: number,
  instructions?: string[],
  type?: RecipeTypeEnum | null,
  image?: string,
  source?: string,

  recipeIngredients: RecipeIngredientInterface[],
}

export class RecipeModel implements RecipeInterface {
  id?: string;
  name: string;
  slug: string;

  cookingDuration?: number;
  preparationDuration?: number;
  waitingDuration?: number;

  nbSlices?: number;
  instructions?: string[];
  type?: RecipeTypeEnum | null;
  image?: string;
  source?: string;

  recipeIngredients: RecipeIngredientModel[] = [];

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

    if (recipe.recipeIngredients?.length > 0) {
      this.recipeIngredients =
        recipe.recipeIngredients.map(recipeIngredient => new RecipeIngredientModel(recipeIngredient));
    }
  }

  get typeName(): string {
    if (!this.type) return '';

    return this.type.charAt(0).toUpperCase() + this.type.slice(1);
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

export const recipeConverter: FirestoreDataConverter<RecipeModel> = {
  toFirestore: (recipe: RecipeModel): RecipeInterface => {
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
    return new RecipeModel(recipeData);
  }
};


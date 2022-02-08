import {FirestoreDataConverter} from '@firebase/firestore';
import {DocumentSnapshot, SnapshotOptions} from 'firebase/firestore';
import {DietTypeEnum} from '../enums/diet-type.enum';
import {IngredientTypeEnum} from '../enums/ingredient-type.enum';
import {RecipeTypeEnum, RecipeTypes} from '../enums/recipe-type.enum';
import {DataObject} from '../services/firestore.service';
import {slugify} from '../tools/slugify';
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
  imagePath?: string,
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
  imagePath?: string;
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
    this.image = recipe.image || '';
    this.imagePath = recipe.imagePath || '';
    this.source = recipe.source;

    if (recipe.recipeIngredients?.length > 0) {
      this.recipeIngredients =
        recipe.recipeIngredients.map(recipeIngredient => new RecipeIngredientModel(recipeIngredient));
    }
  }

  get orderedRecipeIngredients(): RecipeIngredientModel[] {
    const ingredientTypes = Object.keys(IngredientTypeEnum);
    return this.recipeIngredients.sort((a, b) => {
      return ingredientTypes.indexOf(a.ingredient?.type!) - ingredientTypes.indexOf(b.ingredient?.type!);
    });
  }

  get typeName(): string {
    return this.type ? RecipeTypes[this.type] : '';
  }

  get ingredientIds(): string[] {
    return this.recipeIngredients.map(recipeIngredient => recipeIngredient.ingredient?.id!);
  }

  get diet(): string {
    if (this.isVegan()) {
      return DietTypeEnum.vegan;
    } else if (this.isVege()) {
      return DietTypeEnum.vege;
    } else if (this.isFish()) {
      return DietTypeEnum.fish;
    } else if (this.isMeat()) {
      return DietTypeEnum.meat;
    }
    return '';
  }

  get dietClassName(): string {
    if (this.diet === DietTypeEnum.vegan) {
      return 'success';
    }
    if (this.diet === DietTypeEnum.vege) {
      return 'warning';
    }
    if (this.diet === DietTypeEnum.meat) {
      return 'danger';
    }
    if (this.diet === DietTypeEnum.fish) {
      return 'primary';
    }
    return '';
  }

  nameContain(search: string): boolean {
    const regexName = new RegExp(search, 'gi');
    const regexSlug = new RegExp(slugify(search), 'gi');
    return this.name.search(regexName) > -1 || this.slug.search(regexSlug) > -1;
  }

  dietIs(diet: string) {
    if (diet === DietTypeEnum.vege) {
      return this.diet === DietTypeEnum.vegan || this.diet === DietTypeEnum.vege;
    }
    return this.diet === diet;
  }

  isVegan(): boolean {
    for (const recipeIngredient of this.recipeIngredients) {
      if (!recipeIngredient.ingredient?.isVegan()) {
        return false;
      }
    }
    return true;
  }

  isVege(): boolean {
    for (const recipeIngredient of this.recipeIngredients) {
      if (recipeIngredient.ingredient) {
        if (!recipeIngredient.ingredient?.isVege()) {
          return false;
        }
      } else if (recipeIngredient.recipe) {
        /*if (!recipeIngredient.recipe?.isVege()) {
          return false;
        }*/
      }
    }
    return true;
  }

  isMeat(): boolean {
    for (const recipeIngredient of this.recipeIngredients) {
      if (recipeIngredient.ingredient?.isMeat()) {
        return true;
      }
    }
    return false;
  }

  isFish(): boolean {
    for (const recipeIngredient of this.recipeIngredients) {
      if (recipeIngredient.ingredient?.isFish()) {
        return true;
      }
    }
    return false;
  }

  isSweet(): boolean | null {
    if (this.type && RecipeTypes[this.type] === RecipeTypeEnum.ingredient) {
      return null;
    }

    for (const recipeIngredient of this.recipeIngredients) {
      if (recipeIngredient.ingredient?.isSalty()) {
        return false;
      } else if (recipeIngredient.ingredient?.isSweet()) {
        return true;
      }
    }
    return null;
  }

  isSalty(): boolean | null {
    if (this.type && RecipeTypes[this.type] === RecipeTypeEnum.ingredient) {
      return null;
    }

    for (const recipeIngredient of this.recipeIngredients) {
      if (recipeIngredient.ingredient?.isSalty()) {
        return true;
      } else if (recipeIngredient.ingredient?.isSweet()) {
        return false;
      }
    }
    return null;
  }
}

export const recipeConverter: FirestoreDataConverter<RecipeInterface> = {
  toFirestore: (recipe: RecipeModel): RecipeInterface => {
    const recipeFields = {...recipe} as RecipeInterface;
    delete recipeFields.id;
    recipeFields.recipeIngredients = [];

    recipe.recipeIngredients.forEach(recipeIngredient => {
      const recipeIngredientField = {...recipeIngredient};
      delete recipeIngredientField.id;

      recipeIngredientField.ingredientId = recipeIngredient.ingredient?.id! || '';
      delete recipeIngredientField.ingredient;

      recipeIngredientField.recipeId = recipeIngredient.recipe?.id! || '';
      delete recipeIngredientField.recipe;

      recipeFields.recipeIngredients.push({
        ...recipeIngredientField
      });
    });

    return recipeFields;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    return snapshot.data(options) as RecipeInterface;
  }
};


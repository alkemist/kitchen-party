import {FirestoreDataConverter} from '@firebase/firestore';
import {DocumentSnapshot, SnapshotOptions} from 'firebase/firestore';
import {IngredientTypeEnum, IngredientTypes} from '../enums/ingredient-type.enum';
import {DataObject} from '../services/firestore.service';
import {slugify} from '../tools/slugify';
import {RecipeInterface, RecipeModel} from './recipe.model';
import {DateHelper} from "../tools/date.helper";


export interface IngredientInterface extends DataObject {
  id?: string,
  name: string,
  slug: string,

  monthBegin?: number | null,
  monthEnd?: number | null,

  type: IngredientTypeEnum,
  isLiquid?: boolean | null,

  recipeId?: string,
  recipe?: RecipeInterface
}

export interface IngredientFormInterface extends IngredientInterface {
  datesSeason: Date[];
}

export class IngredientModel implements IngredientInterface {
  static saltyNames = [
    'ail', 'herbes de provence', 'noix de muscade', 'curry', 'cumin',
    'moutarde', 'mayonnaise',
    'fromage râpé', 'parmesan', 'pâte brisée', 'pâte à pizza',
    'aubergine', 'salade', 'tomate',
    'sauce soja salé', 'pomme de terre', 'patate douce'
  ];
  static sweetNames = [
    'fraise', 'sucre vanillé', 'chocolat', 'framboise', 'sucre glace', 'spéculoos', 'pâte sablée'
  ];
  id?: string;
  name: string;
  slug: string;
  monthBegin?: number | null;
  monthEnd?: number | null;
  type: IngredientTypeEnum;
  isLiquid: boolean | null;
  recipeId?: string;
  recipe?: RecipeModel;

  constructor(ingredient: IngredientInterface) {
    this.id = ingredient.id;
    this.name = ingredient.name?.trim();
    this.slug = ingredient.slug;
    this.type = ingredient.type;
    this.monthBegin = ingredient.monthBegin;
    this.monthEnd = ingredient.monthEnd;
    this.isLiquid = ingredient.isLiquid || null;
  }

  get typeName(): string {
    return IngredientTypes[this.type];
  }

  get typeIcon(): string {
    if (IngredientTypes[this.type] === IngredientTypeEnum.meats) {
      return 'goat';
    }
    if (IngredientTypes[this.type] === IngredientTypeEnum.fishes_seafoods) {
      return 'directions_boat';
    }
    if (IngredientTypes[this.type] === IngredientTypeEnum.fruits_vegetables_mushrooms) {
      return 'local_florist';
    }
    if (IngredientTypes[this.type] === IngredientTypeEnum.cereals_legumines) {
      return 'grass';
    }
    if (IngredientTypes[this.type] === IngredientTypeEnum.animal_fats) {
      return 'opacity';
    }
    if (IngredientTypes[this.type] === IngredientTypeEnum.vegetable_fats) {
      return 'opacity';
    }
    if (IngredientTypes[this.type] === IngredientTypeEnum.yeasts) {
      return 'bubble_chart';
    }
    if (IngredientTypes[this.type] === IngredientTypeEnum.aromatic_herbs) {
      return 'eco';
    }
    if (IngredientTypes[this.type] === IngredientTypeEnum.spices) {
      return 'bolt';
    }
    if (IngredientTypes[this.type] === IngredientTypeEnum.sugars) {
      return 'view_comfortable';
    }
    if (IngredientTypes[this.type] === IngredientTypeEnum.salts) {
      return 'grain';
    }
    if (IngredientTypes[this.type] === IngredientTypeEnum.alcohols) {
      return 'liquor';
    }
    if (IngredientTypes[this.type] === IngredientTypeEnum.water) {
      return 'local_drink';
    }
    return '';
  }

  nameContain(search: string): boolean {
    const regexName = new RegExp(search, 'gi');
    const regexSlug = new RegExp(slugify(search), 'gi');
    return this.name.search(regexName) > -1 || this.slug.search(regexSlug) > -1;
  }

  hydrate(ingredient: IngredientInterface) {
    this.name = ingredient.name;
    this.slug = ingredient.slug;
    this.type = ingredient.type;
    this.isLiquid = ingredient.isLiquid || null;
  }

  isVege(): boolean {
    return !this.isMeat() && !this.isFish();
  }

  isVegan(): boolean {
    return this.isVege() && IngredientTypes[this.type] !== IngredientTypeEnum.animal_fats;
  }

  isMeat(): boolean {
    return IngredientTypes[this.type] === IngredientTypeEnum.meats;
  }

  isFish(): boolean {
    return IngredientTypes[this.type] === IngredientTypeEnum.fishes_seafoods;
  }

  isSweet(): boolean {
    const name = this.name.toLowerCase();

    if (IngredientModel.sweetNames.includes(name)) {
      return true;
    }

    return false;
  }

  isSalty(): boolean {
    const name = this.name.toLowerCase();
    const regex = new RegExp('bouillon .*', 'gi');

    if (IngredientTypes[this.type] === IngredientTypeEnum.fishes_seafoods
      || IngredientTypes[this.type] === IngredientTypeEnum.meats) {
      return true;
    } else if (IngredientModel.saltyNames.includes(name)) {
      return true;
    } else if (regex.test(this.name)) {
      return true;
    }

    return false;
  }

  isSeason(): boolean {

    if (IngredientTypes[this.type] === IngredientTypeEnum.fruits_vegetables_mushrooms && this.monthBegin && this.monthEnd) {
      const date = new Date();

      let dateBegin = new Date(date.getFullYear(), this.monthBegin - 1, 1);
      dateBegin = DateHelper.monthBegin(dateBegin);

      let dateEnd = new Date(date.getFullYear(), this.monthEnd - 1, 1);
      dateEnd = DateHelper.monthEnd(dateEnd);


      return date.getTime() > dateBegin.getTime() && date.getTime() < dateEnd.getTime();
    }

    return true;
  }

  static format(ingredientForm: IngredientFormInterface) {
    const ingredient = new IngredientModel(ingredientForm);
    if (ingredientForm.datesSeason && ingredientForm.datesSeason.length === 2) {
      ingredient.monthBegin = ingredientForm.datesSeason[0]
        ? DateHelper.monthBegin(ingredientForm.datesSeason[0]).getMonth() + 1
        : null;
      ingredient.monthEnd = ingredientForm.datesSeason[1]
        ? DateHelper.monthEnd(ingredientForm.datesSeason[1]).getMonth() + 1
        : null;
    }
    return ingredient;
  }
}

export const ingredientConverter: FirestoreDataConverter<IngredientInterface> = {
  toFirestore: (ingredient: IngredientModel): IngredientInterface => {
    const ingredientFields = {...ingredient};
    ingredientFields.recipeId = ingredientFields.recipe ? ingredientFields.recipe?.id : '';
    if (!ingredientFields.monthBegin) {
      ingredientFields.monthBegin = null;
    }
    if (!ingredientFields.monthEnd) {
      ingredientFields.monthEnd = null;
    }

    delete ingredientFields.id;
    delete ingredientFields.recipe;
    return ingredientFields;
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    return snapshot.data(options) as IngredientInterface;
  }
};

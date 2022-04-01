import { IngredientTypeIconEnum, IngredientTypeKeyEnum, IngredientTypeLabelEnum, IngredientTypes } from '@enums';
import { IngredientFormInterface, IngredientInterface } from '@interfaces';
import { DateHelper, EnumHelper, slugify } from '@tools';


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
  type: IngredientTypeKeyEnum | string;
  isLiquid: boolean | null;

  constructor(ingredient: IngredientInterface) {
    this.id = ingredient.id ?? '';
    this.name = ingredient.name?.trim() ?? '';
    this.slug = ingredient.slug ?? '';
    this.type = ingredient.type ?? '';
    this.monthBegin = ingredient.monthBegin;
    this.monthEnd = ingredient.monthEnd;
    this.isLiquid = typeof ingredient.isLiquid !== 'undefined' ? ingredient.isLiquid : null;
  }

  get typeName(): string | undefined {
    return IngredientTypes.get(this.type);
  }

  get typeIcon(): string {
    const icons = EnumHelper.enumToMap(IngredientTypeIconEnum);
    return icons.get(this.type) ?? '';
  }

  static format(ingredientForm: IngredientFormInterface) {
    const ingredient = new IngredientModel(ingredientForm);
    if (ingredientForm.dateBegin && ingredientForm.dateEnd) {
      ingredient.monthBegin = ingredientForm.dateBegin.getMonth() + 1;
      ingredient.monthEnd = ingredientForm.dateEnd.getMonth() + 1;
    }
    return ingredient;
  }

  nameContain(search: string): boolean {
    const regexName = new RegExp(search, 'gi');
    const regexSlug = new RegExp(slugify(search), 'gi');
    return this.name.search(regexName) > -1 || this.slug.search(regexSlug) > -1;
  }

  hydrate(ingredient: IngredientInterface): IngredientModel {
    this.name = ingredient.name ?? '';
    this.slug = ingredient.slug ?? '';
    this.type = ingredient.type ?? '';
    this.isLiquid = ingredient.isLiquid || null;
    return this;
  }

  isVege(): boolean {
    return !this.isMeat() && !this.isFish();
  }

  isVegan(): boolean {
    return this.isVege() && IngredientTypes.get(this.type) !== IngredientTypeLabelEnum.animal_fats;
  }

  isMeat(): boolean {
    return IngredientTypes.get(this.type) === IngredientTypeLabelEnum.meats;
  }

  isFish(): boolean {
    return IngredientTypes.get(this.type) === IngredientTypeLabelEnum.fishes_seafoods;
  }

  isSweet(): boolean {
    const name = this.name.toLowerCase();

    return IngredientModel.sweetNames.includes(name);
  }

  isSalty(): boolean {
    const name = this.name.toLowerCase();
    const regex = new RegExp('bouillon .*', 'gi');

    if (IngredientTypes.get(this.type) === IngredientTypeLabelEnum.fishes_seafoods
      || IngredientTypes.get(this.type) === IngredientTypeLabelEnum.meats) {
      return true;
    } else if (IngredientModel.saltyNames.includes(name)) {
      return true;
    } else if (regex.test(this.name)) {
      return true;
    }

    return false;
  }

  isSeason(): boolean {
    if (IngredientTypes.get(this.type) === IngredientTypeLabelEnum.fruits_vegetables_mushrooms && this.monthBegin && this.monthEnd) {
      const date = new Date();
      let monthCurrent = date.getMonth() + 1;
      let yearBegin = date.getFullYear();
      let yearEnd = date.getFullYear();

      if (this.monthEnd < this.monthBegin) {
        if (monthCurrent <= this.monthEnd) {
          yearBegin--;
        } else if (monthCurrent >= this.monthBegin) {
          yearEnd++;
        }
      }

      let dateBegin = new Date(yearBegin, this.monthBegin - 1, 1);
      dateBegin = DateHelper.monthBegin(dateBegin);

      let dateEnd = new Date(yearEnd, this.monthEnd - 1, 1);
      dateEnd = DateHelper.monthEnd(dateEnd);

      return date.getTime() > dateBegin.getTime() && date.getTime() < dateEnd.getTime();
    }

    return true;
  }
}


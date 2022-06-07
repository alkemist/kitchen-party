import { DietTypeLabelEnum, RecipeTypeKeyEnum, RecipeTypeLabelEnum, RecipeTypes } from '@enums';
import { RecipeInterface } from '@interfaces';
import { slugify } from '@tools';
import { RecipeIngredientModel } from './recipe-ingredient.model';

export class RecipeModel implements RecipeInterface {
  static saltyNames = [
    'pâte brisée', 'pâte à pizza',
  ];
  static sweetNames = [
    'pâte sablée'
  ];

  id?: string;
  name: string;
  slug: string;

  cookingDuration?: number;
  preparationDuration?: number;
  waitingDuration?: number;

  nbSlices?: number;
  instructions?: string[];
  type?: RecipeTypeKeyEnum | null;
  image?: string;
  imagePath?: string;
  source?: string;

  recipeIngredients: RecipeIngredientModel[] = [];

  constructor(recipe: RecipeInterface) {
    this.id = recipe.id ?? '';
    this.name = recipe.name ?? '';
    this.slug = recipe.slug ?? '';

    this.cookingDuration = recipe.cookingDuration ?? 0;
    this.preparationDuration = recipe.preparationDuration ?? 0;
    this.waitingDuration = recipe.waitingDuration ?? 0;

    this.nbSlices = recipe.nbSlices ?? 0;
    this.instructions = recipe.instructions || [];
    this.type = recipe.type || null;
    this.imagePath = recipe.imagePath || '';
    this.source = recipe.source ?? '';

    this.image = recipe.image;

    if (recipe.recipeIngredients && recipe.recipeIngredients.length > 0) {
      this.recipeIngredients =
        recipe.recipeIngredients.map(recipeIngredient => new RecipeIngredientModel(recipeIngredient));
    }
  }

  get orderedRecipeIngredients(): RecipeIngredientModel[] {
    return RecipeIngredientModel.orderRecipeIngredients(this.recipeIngredients) as RecipeIngredientModel[];
  }

  get typeName(): string {
    return this.type ? RecipeTypes.get(this.type)! : '';
  }

  get ingredientIds(): string[] {
    return this.recipeIngredients.map(recipeIngredient => recipeIngredient.ingredientIds!).flat();
  }

  get diet(): DietTypeLabelEnum | string {
    if (this.recipeIngredients.length > 0) {
      if (this.isVegan()) {
        return DietTypeLabelEnum.vegan;
      } else if (this.isVege()) {
        return DietTypeLabelEnum.vege;
      } else if (this.isFish()) {
        return DietTypeLabelEnum.fish;
      } else if (this.isMeat()) {
        return DietTypeLabelEnum.meat;
      }
    }
    return '';
  }

  get dietClassName(): string {
    if (this.recipeIngredients.length > 0) {
      if (this.diet === DietTypeLabelEnum.vegan) {
        return 'success';
      }
      if (this.diet === DietTypeLabelEnum.vege) {
        return 'warning';
      }
      if (this.diet === DietTypeLabelEnum.meat) {
        return 'danger';
      }
      if (this.diet === DietTypeLabelEnum.fish) {
        return 'primary';
      }
    }
    return '';
  }

  nameContain(search: string): boolean {
    const regexName = new RegExp(search, 'gi');
    const regexSlug = new RegExp(slugify(search), 'gi');
    return this.name.search(regexName) > -1 || this.slug.search(regexSlug) > -1;
  }

  dietIs(diet: string): boolean {
    if (diet === DietTypeLabelEnum.vege) {
      return this.diet === DietTypeLabelEnum.vegan || this.diet === DietTypeLabelEnum.vege;
    }
    return this.diet === diet;
  }

  isSeason(): boolean {
    for (const recipeIngredient of this.recipeIngredients) {
      if (recipeIngredient.ingredient && !recipeIngredient.ingredient?.isSeason()) {
        return false;
      }
    }
    return true;
  }

  isVegan(): boolean {
    for (const recipeIngredient of this.recipeIngredients) {
      if (recipeIngredient.ingredient) {
        if (!recipeIngredient.ingredient.isVegan()) {
          return false;
        }
      } else if (recipeIngredient.recipe) {
        if (!recipeIngredient.recipe.isVegan()) {
          return false;
        }
      }
    }
    return true;
  }

  isVege(): boolean {
    for (const recipeIngredient of this.recipeIngredients) {
      if (recipeIngredient.ingredient) {
        if (!recipeIngredient.ingredient.isVege()) {
          return false;
        }
      } else if (recipeIngredient.recipe) {
        if (!recipeIngredient.recipe.isVege()) {
          return false;
        }
      }
    }
    return true;
  }

  isMeat(): boolean {
    for (const recipeIngredient of this.recipeIngredients) {
      if (recipeIngredient.ingredient) {
        if (recipeIngredient.ingredient.isMeat()) {
          return true;
        }
      } else if (recipeIngredient.recipe) {
        if (recipeIngredient.recipe.isMeat()) {
          return true;
        }
      }
    }
    return false;
  }

  isFish(): boolean {
    for (const recipeIngredient of this.recipeIngredients) {
      if (recipeIngredient.ingredient) {
        if (recipeIngredient.ingredient.isFish()) {
          return true;
        }
      } else if (recipeIngredient.recipe) {
        if (recipeIngredient.recipe.isFish()) {
          return true;
        }
      }
    }
    return false;
  }

  recipeIngredientsOption(option: DietTypeLabelEnum | string): RecipeIngredientModel[] {
    const recipeIngredients = [];

    for (const recipeIngredient of this.recipeIngredients) {
      if (option === DietTypeLabelEnum.meat && recipeIngredient.optionCarne) {
        recipeIngredients.push(recipeIngredient);
      }

      if (option === DietTypeLabelEnum.vege && recipeIngredient.optionVege) {
        recipeIngredients.push(recipeIngredient);
      }

      if (option === DietTypeLabelEnum.vegan && recipeIngredient.optionVegan) {
        recipeIngredients.push(recipeIngredient);
      }

      if (!recipeIngredient.optionCarne && !recipeIngredient.optionVege && !recipeIngredient.optionVegan) {
        recipeIngredients.push(recipeIngredient);
      }
    }

    return recipeIngredients;
  }

  getOptions(): RecipeModel[] {
    const options: RecipeModel[] = [];
    const optionsCarn: RecipeIngredientModel[] = [];
    const optionsVege: RecipeIngredientModel[] = [];
    const optionsVegan: RecipeIngredientModel[] = [];
    const optionsOther: RecipeIngredientModel[] = [];

    for (const recipeIngredient of this.recipeIngredients) {
      if (recipeIngredient.optionCarne) {
        optionsCarn.push(recipeIngredient);
      } else if (recipeIngredient.optionVege) {
        optionsVege.push(recipeIngredient);
      } else if (recipeIngredient.optionVegan) {
        optionsVegan.push(recipeIngredient);
      } else {
        optionsOther.push(recipeIngredient);
      }
    }

    if (optionsCarn.length > 0) {
      const recipeCarn = new RecipeModel(this);
      recipeCarn.recipeIngredients = optionsOther.concat(optionsCarn);
      options.push(recipeCarn);
    }
    if (optionsVege.length > 0) {
      const recipeVege = new RecipeModel(this);
      recipeVege.recipeIngredients = optionsOther.concat(optionsVege);
      options.push(recipeVege);
    }
    if (optionsVegan.length > 0) {
      const recipeVegan = new RecipeModel(this);
      recipeVegan.recipeIngredients = optionsOther.concat(optionsVegan);
      options.push(recipeVegan);
    }

    return options;
  }

  isSweet(): boolean | null {
    if (this.type && RecipeTypes.get(this.type) === RecipeTypeLabelEnum.ingredient) {
      const name = this.name.toLowerCase();

      if (RecipeModel.sweetNames.includes(name)) {
        return true;
      }
      return null;
    }

    for (const recipeIngredient of this.recipeIngredients) {
      if (recipeIngredient.ingredient) {
        if (recipeIngredient.ingredient?.isSalty()) {
          return false;
        } else if (recipeIngredient.ingredient?.isSweet()) {
          return true;
        }
      } else if (recipeIngredient.recipe) {
        if (recipeIngredient.recipe?.isSalty()) {
          return false;
        } else if (recipeIngredient.recipe?.isSweet()) {
          return true;
        }
      }
    }
    return null;
  }

  isSalty(): boolean | null {
    if (this.type && RecipeTypes.get(this.type) === RecipeTypeLabelEnum.ingredient) {
      const name = this.name.toLowerCase();

      if (RecipeModel.saltyNames.includes(name)) {
        return true;
      }
      return null;
    }

    for (const recipeIngredient of this.recipeIngredients) {
      if (recipeIngredient.ingredient) {
        if (recipeIngredient.ingredient?.isSalty()) {
          return true;
        } else if (recipeIngredient.ingredient?.isSweet()) {
          return false;
        }
      } else if (recipeIngredient.recipe) {
        if (recipeIngredient.recipe?.isSalty()) {
          return true;
        } else if (recipeIngredient.recipe?.isSweet()) {
          return false;
        }
      }
    }
    return null;
  }
}


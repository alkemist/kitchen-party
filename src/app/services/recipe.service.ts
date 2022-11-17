import { Injectable } from '@angular/core';
import { recipeConverter } from '@converters';
import { DocumentNotFoundError } from '@errors';
import {KeyLabelInterface, RecipeInterface} from '@interfaces';
import {RecipeModel} from '@models';
import { Select, Store } from '@ngxs/store';
import { FirestoreService, IngredientService, LoggerService } from '@services';
import {AddRecipe, FillRecipes, RecipeState, RemoveRecipe, UpdateRecipe} from '@stores';
import { ArrayHelper } from '@tools';
import { orderBy } from 'firebase/firestore';
import { first, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService extends FirestoreService<RecipeInterface> {
  customMeasures: KeyLabelInterface[] = [];
  @Select(RecipeState.lastUpdated) protected override lastUpdated$?: Observable<Date>;

  // Données du store
  @Select(RecipeState.all) protected override all$?: Observable<RecipeInterface[]>;
  @Select(RecipeState.customMeasure) private customMeasures$?: Observable<KeyLabelInterface[]>;

  // Données du service
  private all: RecipeModel[] = [];

  constructor(private logger: LoggerService, private store: Store, private ingredientService: IngredientService) {
    super(logger, 'recipe', recipeConverter);
    this.customMeasures$?.subscribe(customMeasures => {
      this.customMeasures = customMeasures;
    });
  }

  async getListOrRefresh(): Promise<RecipeModel[]> {
    return new Promise<RecipeModel[]>(async resolve => {
      // Si les données ont déjà été chargé dans le service
      if (this.loaded) {
        resolve(this.all);
      }
      // Sinon, si des données à jour sont dans le store
      else if (this.all$ && !this.storeIsOutdated()) {

        this.getAll$()?.pipe(first()).subscribe(async recipes => {
          resolve(this.refreshList(recipes));
        })

      }
      // Sinon on rafraichit le store
      else {
        const recipes = await super.queryList(orderBy('name'));
        this.store.dispatch(new FillRecipes(recipes));

        resolve(this.refreshList(recipes));
      }
    });
  }

  async refreshList(recipes: RecipeInterface[]): Promise<RecipeModel[]> {
    this.all = [];
    for (const recipe of recipes) {
      const recipeModel = new RecipeModel(recipe);
      await this.hydrate(recipeModel, recipes);
      this.all.push(recipeModel);
    }
    this.all = ArrayHelper.sortBy<RecipeModel>(this.all, 'slug');
    this.loaded = true;

    return this.all;
  }

  async search(query: string): Promise<RecipeModel[]> {
    const recipes = await this.getListOrRefresh();
    return recipes.filter((recipe: RecipeModel) => {
      return recipe.nameContain(query);
    });
  }

  async getBySlug(slug: string): Promise<RecipeModel | undefined> {
    const recipes = await this.getListOrRefresh();
    const recipe = recipes.find((recipe: RecipeModel) => {
      return recipe.slug === slug;
    })!;
    return recipe ?? undefined;
  }

  async getById(id: string): Promise<RecipeModel | undefined> {
    const recipes = await this.getListOrRefresh();
    const recipe = recipes.find((recipe: RecipeInterface) => {
      return recipe.id === id;
    })!;
    return recipe ?? undefined;
  }

  async get(slug: string): Promise<RecipeModel | undefined> {
    if (!slug) {
      return undefined;
    }

    let recipe = await this.getBySlug(slug);
    if (!recipe) {
      try {
        let recipeData = await super.findOneBySlug(slug);
        await this.addToStore(recipeData);
        this.invalidLocalData();

        return new RecipeModel(recipeData);
      } catch (e) {
        if (e instanceof DocumentNotFoundError) {
          return undefined;
        }
      }
    }
    return recipe;
  }

  async add(recipe: RecipeInterface): Promise<RecipeInterface | undefined> {
    const recipeStored = await super.addOne(new RecipeModel(recipe));
    return this.addToStore(recipeStored);
  }

  async update(recipe: RecipeInterface): Promise<RecipeInterface | undefined> {
    const recipeStored = await super.updateOne(new RecipeModel(recipe));
    this.store.dispatch(new UpdateRecipe(recipeStored));
    return recipeStored;
  }

  async remove(recipe: RecipeInterface): Promise<void> {
    await super.removeOne(recipe);
    this.store.dispatch(new RemoveRecipe(recipe));
  }

  override async exist(name: string): Promise<boolean> {
    return await super.exist(name);
  }

  private addToStore(recipe: RecipeInterface): RecipeInterface {
    this.store.dispatch(new AddRecipe(recipe));
    return recipe;
  }

  private async hydrate(recipe: RecipeModel, recipes: RecipeInterface[]): Promise<void> {
    if (recipe.recipeIngredients) {
      for (const recipeIngredient of recipe.recipeIngredients) {
        if (recipeIngredient.ingredientId) {
          recipeIngredient.ingredient = await this.ingredientService.getById(recipeIngredient.ingredientId);
        }
        delete recipeIngredient.ingredientId;

        if (recipeIngredient.recipeId) {
          const recipe = recipes.find(recipe => recipe.id === recipeIngredient.recipeId);
          if (recipe) {
            recipeIngredient.recipe = new RecipeModel(recipe);
          }
        }
        delete recipeIngredient.recipeId;
      }
    }
  }
}

import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { orderBy } from 'firebase/firestore';
import { first, Observable } from 'rxjs';
import { recipeConverter } from '../converters/recipe.converter';
import { DocumentNotFound } from '../errors';
import { KeyLabelInterface, RecipeInterface } from '../interfaces';
import { RecipeModel } from '../models';
import { AddRecipe, FillRecipes, RemoveRecipe, UpdateRecipe } from '../stores/recipe.action';
import { RecipeState } from '../stores/recipe.state';
import { ArrayHelper } from '../tools';
import { FirestoreService } from './firestore.service';
import { IngredientService } from './ingredient.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService extends FirestoreService<RecipeInterface> {
  customMeasures: KeyLabelInterface[] = [];
  @Select(RecipeState.lastUpdated) protected override lastUpdated$?: Observable<Date>;
  @Select(RecipeState.all) protected override all$?: Observable<RecipeInterface[]>;

  @Select(RecipeState.customMeasure) private customMeasures$?: Observable<KeyLabelInterface[]>;

  private all: RecipeModel[] = [];
  private promise: Promise<RecipeModel[]> | undefined;

  constructor(private logger: LoggerService, private store: Store, private ingredientService: IngredientService) {
    super(logger, 'recipe', recipeConverter);
    this.customMeasures$?.subscribe(customMeasures => {
      this.customMeasures = customMeasures;
    });
  }

  async getListOrRefresh(): Promise<RecipeModel[]> {
    if (this.promise) {
      return this.promise;
    }

    if ((this.all.length > 0 || this.refreshed) && this.synchronized) {
      return this.all;
    }

    this.promise = new Promise<RecipeModel[]>((resolve) => {
      this.all$?.pipe(first()).subscribe(async recipes => {
        if (recipes.length === 0 && !this.refreshed || this.storeIsOutdated()) {
          recipes = await this.refreshList();
        }

        this.all = [];
        for (const recipe of recipes) {
          const recipeModel = new RecipeModel(recipe);
          await this.hydrate(recipeModel, recipes);
          this.all.push(recipeModel);
        }
        this.all = ArrayHelper.sortBy<RecipeModel>(this.all, 'slug');
        this.synchronized = true;
        resolve(this.all);
      });
    });
    return this.promise;
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
        return new RecipeModel(this.addToStore(recipeData));
      } catch (e) {
        if (e instanceof DocumentNotFound) {
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

  private async refreshList(): Promise<RecipeInterface[]> {
    const recipes = await super.select(orderBy('name'));

    this.store.dispatch(new FillRecipes(recipes));
    return recipes;
  }

  private addToStore(recipe: RecipeInterface): RecipeInterface {
    this.store.dispatch(new AddRecipe(recipe));
    return recipe;
  }

  private async hydrate(recipe: RecipeInterface, recipes: RecipeInterface[]): Promise<RecipeInterface> {
    for (const recipeIngredient of recipe.recipeIngredients) {
      if (recipeIngredient.ingredientId) {
        recipeIngredient.ingredient = await this.ingredientService.getById(recipeIngredient.ingredientId);
      }
      delete recipeIngredient.ingredientId;

      if (recipeIngredient.recipeId) {
        recipeIngredient.recipe = new RecipeModel(recipes.find(recipe => recipe.id === recipeIngredient.recipeId)!);
      }
      delete recipeIngredient.recipeId;
    }
    return recipe;
  }
}

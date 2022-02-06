import {Injectable} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {orderBy} from 'firebase/firestore';
import {Observable} from 'rxjs';
import {KeyObject} from '../models/other.model';
import {recipeConverter, RecipeModel} from '../models/recipe.model';
import {AddRecipe, FillRecipes, RemoveRecipe, UpdateRecipe} from '../store/recipe.action';
import {RecipeState} from '../store/recipe.state';
import {DocumentNotFound, FirestoreService} from './firestore.service';
import {IngredientService} from './ingredient.service';
import {LoggerService} from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService extends FirestoreService<RecipeModel> {
  refreshed = false;
  customMeasures: KeyObject[] = [];
  @Select(RecipeState.lastUpdated) protected override lastUpdated$?: Observable<Date>;
  @Select(RecipeState.all) private all$?: Observable<RecipeModel[]>;
  private all: RecipeModel[] = [];
  @Select(RecipeState.customMeasure) private customMeasures$?: Observable<KeyObject[]>;

  constructor(private logger: LoggerService, private store: Store, private ingredientService: IngredientService) {
    super(logger, 'recipe', recipeConverter);
    this.customMeasures$?.subscribe(customMeasures => {
      this.customMeasures = customMeasures;
    });
  }

  async getListOrRefresh(): Promise<RecipeModel[]> {
    return new Promise<RecipeModel[]>(resolve => {
      this.all$?.subscribe(async recipes => {
        if (recipes.length === 0 && !this.refreshed || this.storeIsOutdated()) {
          return await this.refreshList();
        }

        for (const recipe of recipes) {
          const recipeHydrated = await this.hydrate(recipe, recipes);
          this.all.push(new RecipeModel(recipeHydrated));
        }
        this.sort(this.all);
        resolve(this.all);
      });
    });
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
    return recipe ? new RecipeModel(recipe) : undefined;
  }

  async getById(id: string): Promise<RecipeModel | undefined> {
    const recipes = await this.getListOrRefresh();
    const recipe = recipes.find((recipe: RecipeModel) => {
      return recipe.id === id;
    })!;
    return recipe ? new RecipeModel(recipe) : undefined;
  }

  async get(slug: string): Promise<RecipeModel | undefined> {
    if (!slug) {
      return undefined;
    }

    let recipe = await this.getBySlug(slug);
    if (!recipe) {
      try {
        recipe = await super.findOneBySlug(slug);
        return this.addToStore(recipe);
      } catch (e) {
        if (e instanceof DocumentNotFound) {
          return undefined;
        }
      }
    }
    return recipe;
  }

  async add(recipe: RecipeModel): Promise<RecipeModel | undefined> {
    const recipeStored = await super.addOne(recipe);
    return this.addToStore(recipe);
  }

  async update(recipe: RecipeModel): Promise<RecipeModel | undefined> {
    const recipeStored = await super.updateOne(recipe);
    await this.hydrate(recipeStored);
    this.store.dispatch(new UpdateRecipe(recipeStored));
    return recipeStored;
  }

  async remove(recipe: RecipeModel): Promise<void> {
    await super.removeOne(recipe);
    this.store.dispatch(new RemoveRecipe(recipe));
  }

  override async exist(name: string): Promise<boolean> {
    return await super.exist(name);
  }

  private async refreshList(): Promise<void> {
    const recipes = await super.select(orderBy('name'));
    this.refreshed = true;

    this.store.dispatch(new FillRecipes(recipes));
  }

  private async addToStore(recipe: RecipeModel) {
    await this.hydrate(recipe);
    this.store.dispatch(new AddRecipe(recipe));
    return recipe;
  }

  private async hydrate(recipe: RecipeModel, recipes?: RecipeModel[]): Promise<RecipeModel> {
    for (const recipeIngredient of recipe.recipeIngredients) {
      if (recipeIngredient.ingredientId) {
        recipeIngredient.ingredient = await this.ingredientService.getById(recipeIngredient.ingredientId);
      }
      delete recipeIngredient.ingredientId;

      if (recipeIngredient.recipeId) {
        recipeIngredient.recipe = recipes
          ? recipes.find(recipe => recipe.id === recipeIngredient.recipeId)
          : await this.getById(recipeIngredient.recipeId);
      }
      delete recipeIngredient.recipeId;
    }
    return recipe;
  }
}

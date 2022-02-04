import {Injectable} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {orderBy} from 'firebase/firestore';
import {recipeConverter, RecipeModel} from '../models/recipe.model';
import {AddRecipe, FillRecipes, RemoveRecipe, UpdateRecipe} from '../store/recipe.action';
import {DocumentNotFound, FirestoreService} from './firestore.service';
import {IngredientService} from './ingredient.service';
import {LoggerService} from './logger.service';
import {Observable} from "rxjs";
import {RecipeState} from "../store/recipe.state";

@Injectable({
  providedIn: 'root'
})
export class RecipeService extends FirestoreService<RecipeModel> {
  @Select(RecipeState.lastUpdated) override lastUpdated$?: Observable<Date>;

  constructor(private logger: LoggerService, private store: Store, private ingredientService: IngredientService) {
    super(logger, 'recipe', recipeConverter);
  }

  getList(): RecipeModel[] {
    const recipes = this.store.selectSnapshot<RecipeModel[]>(state => state.recipes.all);
    return recipes.map(recipe => new RecipeModel(recipe));
  }

  getCustomMeasures(): { key: string, label: string }[] {
    const recipes = this.getList();
    let measures = recipes.map(recipe => {
      return recipe.recipeIngredients.map(recipeIngredient => recipeIngredient.measure);
    });
    const uniqueMeasures = measures.flat().filter((value, index, self) => {
      return value && self.indexOf(value) === index;
    });
    return uniqueMeasures.map(measure => {
      return {
        key: measure,
        label: measure
      };
    });
  }

  async getListOrRefresh(): Promise<RecipeModel[]> {
    const recipes = this.getList();
    if (recipes.length === 0 || this.storeIsOutdated()) {
      return await this.refreshList();
    }
    return recipes;
  }

  async search(query: string): Promise<RecipeModel[]> {
    const recipes = await this.getListOrRefresh();
    return recipes.filter((recipe: RecipeModel) => {
      return recipe.nameContain(query);
    });
  }

  async getBySlug(slug: string): Promise<RecipeModel> {
    const recipes = await this.getListOrRefresh();
    const recipe = recipes.find((recipe: RecipeModel) => {
      return recipe.slug === slug;
    })!;
    return new RecipeModel(recipe);
  }

  async getById(id: string): Promise<RecipeModel> {
    const recipes = await this.getListOrRefresh();
    return recipes.find((recipe: RecipeModel) => {
      return recipe.id === id;
    })!;
  }

  async refreshList(): Promise<RecipeModel[]> {
    const recipes = await super.select(orderBy('name'));
    for (const recipe of recipes) {
      await this.hydrate(recipe);
    }
    this.store.dispatch(new FillRecipes(recipes));
    return this.getList();
  }

  async get(slug: string): Promise<RecipeModel | undefined> {
    if (!slug) {
      return undefined;
    }

    let recipe = await this.getBySlug(slug);
    if (!recipe) {
      try {
        recipe = await super.findOneBySlug(slug);
        await this.hydrate(recipe);
        this.store.dispatch(new AddRecipe(recipe));
        return this.getBySlug(slug);
      } catch (e) {
        if (e instanceof DocumentNotFound) {
          return undefined;
        }
      }
    }
    return recipe;
  }

  async add(recipe: RecipeModel): Promise<RecipeModel> {
    const recipeStored = await super.addOne(recipe);
    await this.hydrate(recipeStored);
    this.store.dispatch(new AddRecipe(recipeStored));
    return this.getBySlug(recipeStored.slug);
  }

  async update(recipe: RecipeModel): Promise<RecipeModel> {
    const recipeStored = await super.updateOne(recipe);
    await this.hydrate(recipeStored);
    this.store.dispatch(new UpdateRecipe(recipeStored));
    return this.getBySlug(recipeStored.slug);
  }

  async remove(recipe: RecipeModel): Promise<void> {
    await super.removeOne(recipe);
    this.store.dispatch(new RemoveRecipe(recipe));
  }

  override async exist(name: string): Promise<boolean> {
    return await super.exist(name);
  }

  private async hydrate(recipe: RecipeModel): Promise<void> {
    for (const recipeIngredient of recipe.recipeIngredients) {
      if (recipeIngredient.ingredientId) {
        recipeIngredient.ingredient = await this.ingredientService.getById(recipeIngredient.ingredientId);
      }
      delete recipeIngredient.ingredientId;
    }
  }
}

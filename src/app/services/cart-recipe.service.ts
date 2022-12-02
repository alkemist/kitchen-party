import { Injectable } from '@angular/core';
import { cartRecipeConverter } from '@converters';
import { DocumentNotFoundError } from '@errors';
import { CartRecipeInterface } from '@interfaces';
import { CartRecipeModel, RecipeModel } from '@models';
import { Select, Store } from '@ngxs/store';
import { FirestoreService, LoggerService, RecipeService } from '@services';
import { AddCartRecipe, CartRecipeState, FillCartRecipes, RemoveCartRecipe, UpdateCartRecipe } from '@stores';
import { ArrayHelper } from '@tools';
import { orderBy } from 'firebase/firestore';
import { first, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CartRecipeService extends FirestoreService<CartRecipeInterface> {
  @Select(CartRecipeState.lastUpdated) override lastUpdated$?: Observable<Date>;

  // Données du store
  @Select(CartRecipeState.all) protected override all$?: Observable<CartRecipeInterface[]>;

  // Données du service
  private all: CartRecipeModel[] = [];

  constructor(private logger: LoggerService, private store: Store,
              private recipeService: RecipeService,
  ) {
    super(logger, 'cart', cartRecipeConverter);
  }

  async getListOrRefresh(): Promise<CartRecipeModel[]> {
    return new Promise<CartRecipeModel[]>(async resolve => {
      // Si les données ont déjà été chargé dans le service
      if (this.loaded) {
        resolve(this.all);
      }
      // Sinon, si des données à jour sont dans le store
      else if (this.all$ && !this.storeIsOutdated()) {
        this.getAll$()?.pipe(first()).subscribe(async cartRecipes => {
          await this.refreshList(cartRecipes);
          this.loaded = true;
          resolve(this.all);
        })

      }
      // Sinon on rafraichit le store
      else {
        const cartRecipes = await super.queryList(orderBy('slug'));
        this.store.dispatch(new FillCartRecipes(cartRecipes));
        await this.refreshList(cartRecipes);
        this.loaded = true;
        resolve(this.all);
      }
    });
  }

  async refreshList(cartRecipes: CartRecipeInterface[]): Promise<CartRecipeModel[]> {
    this.all = [];

    for (const cartRecipe of cartRecipes) {
      const cartRecipeModel = new CartRecipeModel(cartRecipe);
      await this.hydrate(cartRecipeModel);
      this.all.push(cartRecipeModel);
    }
    this.all = ArrayHelper.sortBy<CartRecipeModel>(this.all, 'slug');
    return this.all;
  }

  async search(query: string): Promise<CartRecipeModel[]> {
    const cartRecipes = await this.getListOrRefresh();
    return cartRecipes.filter((cartRecipe: CartRecipeModel) => {
      return cartRecipe.recipe?.nameContain(query);
    });
  }

  async getByRecipeId(recipeId: string): Promise<CartRecipeModel | undefined> {
    const cartRecipes = await this.getListOrRefresh();
    const cartRecipe = cartRecipes.find((cartRecipe: CartRecipeModel) => {
      return cartRecipe.recipe?.id === recipeId;
    })!;
    return cartRecipe ?? undefined;
  }

  async getById(id: string): Promise<CartRecipeModel | undefined> {
    const cartRecipes = await this.getListOrRefresh();
    const cartRecipe = cartRecipes.find((cartRecipe: CartRecipeModel) => {
      return cartRecipe.id === id;
    })!;
    return cartRecipe ?? undefined;
  }

  async get(recipeId: string): Promise<CartRecipeModel | undefined> {
    if (!recipeId) {
      return undefined;
    }

    let cartRecipe = await this.getByRecipeId(recipeId);
    if (!cartRecipe) {
      try {
        let cartRecipeData = await super.findOneBy('recipeId', recipeId);
        await this.addToStore(cartRecipeData);
        this.invalidLocalData();

        return new CartRecipeModel(cartRecipeData);
      } catch (e) {
        if (e instanceof DocumentNotFoundError) {
          return undefined;
        }
      }
    }
    return cartRecipe;
  }

  async updateOrCreate(recipe: RecipeModel): Promise<void> {
    if (!recipe.id) {
      return undefined;
    }

    let cartRecipe = await this.get(recipe.id);

    if (!cartRecipe) {
      await this.add({
        recipe: recipe,
        quantity: 1,
      });
    } else {
      await this.updateQuantity(cartRecipe, 1);
    }
  }

  async updateQuantity(cartRecipe: CartRecipeModel, quantity: number): Promise<void> {
    cartRecipe.quantity = cartRecipe.quantity + quantity;

    if (cartRecipe.quantity <= 0) {
      await this.remove(cartRecipe);
    } else {
      await this.update(cartRecipe);
    }
  }

  async add(cartRecipe: CartRecipeInterface): Promise<CartRecipeInterface | undefined> {
    const cartRecipeStored = await super.addOne(new CartRecipeModel(cartRecipe));
    return this.addToStore(cartRecipeStored);
  }

  async update(cartRecipe: CartRecipeInterface): Promise<CartRecipeInterface | undefined> {
    const cartRecipeStored = await super.updateOne(new CartRecipeModel(cartRecipe));
    this.store.dispatch(new UpdateCartRecipe(cartRecipeStored));
    return cartRecipeStored;
  }

  async remove(cartRecipe: CartRecipeInterface): Promise<void> {
    await super.removeOne(cartRecipe);
    this.store.dispatch(new RemoveCartRecipe(cartRecipe));
  }

  override async exist(name: string): Promise<boolean> {
    return await super.exist(name);
  }

  private addToStore(cartRecipe: CartRecipeInterface): CartRecipeInterface {
    this.store.dispatch(new AddCartRecipe(cartRecipe));
    return cartRecipe;
  }

  private async hydrate(cartRecipe: CartRecipeModel): Promise<void> {
    if (cartRecipe.recipeId) {
      cartRecipe.recipe = await this.recipeService.getById(cartRecipe.recipeId);
    }
    delete cartRecipe.recipeId;
  }

  async removeAll() {
    this.all.forEach((cartRecipe) => {
      this.remove(cartRecipe);
    });
  }
}


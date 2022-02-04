import {Injectable} from '@angular/core';
import {DocumentNotFound, FirestoreService} from "./firestore.service";
import {Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {LoggerService} from "./logger.service";
import {IngredientService} from "./ingredient.service";
import {orderBy} from "firebase/firestore";
import {kitchenIngredientConverter, KitchenIngredientModel} from "../models/kitchen-ingredient.model";
import {KitchenIngredientState} from "../store/kitchen.state";
import {
  AddKitchenIngredient,
  FillKitchenIngredients,
  RemoveKitchenIngredient,
  UpdateKitchenIngredient
} from "../store/kitchen.action";
import {RecipeService} from "./recipe.service";

@Injectable({
  providedIn: 'root'
})
export class KitchenIngredientService extends FirestoreService<KitchenIngredientModel> {
  @Select(KitchenIngredientState.lastUpdated) override lastUpdated$?: Observable<Date>;

  constructor(private logger: LoggerService, private store: Store,
              private ingredientService: IngredientService,
              private recipeService: RecipeService
  ) {
    super(logger, 'kitchen', kitchenIngredientConverter);
  }

  async getListOrRefresh(): Promise<KitchenIngredientModel[]> {
    const kitchenIngredients = this.getList();
    if (kitchenIngredients.length === 0 || this.storeIsOutdated()) {
      return await this.refreshList();
    }
    return this.sort(kitchenIngredients);
  }

  async search(query: string): Promise<KitchenIngredientModel[]> {
    const kitchenIngredients = await this.getListOrRefresh();
    return kitchenIngredients.filter((kitchenIngredient: KitchenIngredientModel) => {
      return kitchenIngredient.ingredient?.nameContain(query);
    });
  }

  async getBySlug(slug: string): Promise<KitchenIngredientModel | undefined> {
    const kitchenIngredients = await this.getListOrRefresh();
    const kitchenIngredient = kitchenIngredients.find((kitchenIngredient: KitchenIngredientModel) => {
      return kitchenIngredient.ingredient?.slug === slug;
    })!;
    return kitchenIngredient ? new KitchenIngredientModel(kitchenIngredient) : undefined;
  }

  async getById(id: string): Promise<KitchenIngredientModel | undefined> {
    const kitchenIngredients = await this.getListOrRefresh();
    const kitchenIngredient = kitchenIngredients.find((kitchenIngredient: KitchenIngredientModel) => {
      return kitchenIngredient.id === id;
    })!;
    return kitchenIngredient ? new KitchenIngredientModel(kitchenIngredient) : undefined;
  }

  async refreshList(): Promise<KitchenIngredientModel[]> {
    const kitchenIngredients = await super.select(orderBy('name'));
    for (const kitchenIngredient of kitchenIngredients) {
      await this.hydrate(kitchenIngredient);
    }
    this.store.dispatch(new FillKitchenIngredients(kitchenIngredients));
    return this.getList();
  }

  async get(slug: string): Promise<KitchenIngredientModel | undefined> {
    if (!slug) {
      return undefined;
    }

    let kitchenIngredient = await this.getBySlug(slug);
    if (!kitchenIngredient) {
      try {
        kitchenIngredient = await super.findOneBySlug(slug);
        await this.hydrate(kitchenIngredient);
        this.store.dispatch(new AddKitchenIngredient(kitchenIngredient));
        return this.getBySlug(slug);
      } catch (e) {
        if (e instanceof DocumentNotFound) {
          return undefined;
        }
      }
    }
    return kitchenIngredient;
  }

  async add(kitchenIngredient: KitchenIngredientModel): Promise<KitchenIngredientModel | undefined> {
    const kitchenIngredientStored = await super.addOne(kitchenIngredient);
    await this.hydrate(kitchenIngredientStored);
    this.store.dispatch(new AddKitchenIngredient(kitchenIngredientStored));
    return this.getBySlug(kitchenIngredientStored.ingredient?.slug!);
  }

  async update(kitchenIngredient: KitchenIngredientModel): Promise<KitchenIngredientModel | undefined> {
    const kitchenIngredientStored = await super.updateOne(kitchenIngredient);
    await this.hydrate(kitchenIngredientStored);
    this.store.dispatch(new UpdateKitchenIngredient(kitchenIngredientStored));
    return this.getBySlug(kitchenIngredientStored.ingredient?.slug!);
  }

  async remove(kitchenIngredient: KitchenIngredientModel): Promise<void> {
    await super.removeOne(kitchenIngredient);
    this.store.dispatch(new RemoveKitchenIngredient(kitchenIngredient));
  }

  override async exist(name: string): Promise<boolean> {
    return await super.exist(name);
  }

  private getList(): KitchenIngredientModel[] {
    const kitchenIngredients = this.store.selectSnapshot<KitchenIngredientModel[]>(state => state.kitchenIngredients.all);
    return kitchenIngredients.map(kitchenIngredient => new KitchenIngredientModel(kitchenIngredient));
  }

  private async hydrate(kitchenIngredient: KitchenIngredientModel): Promise<void> {
    if (kitchenIngredient.ingredientId) {
      kitchenIngredient.ingredient = await this.ingredientService.getById(kitchenIngredient.ingredientId);
    }
    delete kitchenIngredient.ingredientId;
    if (kitchenIngredient.recipeId) {
      kitchenIngredient.recipe = await this.recipeService.getById(kitchenIngredient.recipeId);
    }
    delete kitchenIngredient.ingredientId;
  }
}


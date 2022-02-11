import {Injectable} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable, Subscription} from 'rxjs';
import {
  kitchenIngredientConverter,
  KitchenIngredientInterface,
  KitchenIngredientModel
} from '../models/kitchen-ingredient.model';
import {
  AddKitchenIngredient,
  FillKitchenIngredients,
  RemoveKitchenIngredient,
  UpdateKitchenIngredient
} from '../store/kitchen.action';
import {KitchenIngredientState} from '../store/kitchen.state';
import {ArrayHelper} from '../tools/array.helper';
import {DocumentNotFound, FirestoreService} from './firestore.service';
import {IngredientService} from './ingredient.service';
import {LoggerService} from './logger.service';
import {RecipeService} from './recipe.service';
import {orderBy} from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class KitchenIngredientService extends FirestoreService<KitchenIngredientInterface> {
  @Select(KitchenIngredientState.lastUpdated) override lastUpdated$?: Observable<Date>;
  @Select(KitchenIngredientState.all) protected override all$?: Observable<KitchenIngredientInterface[]>;

  private allSubscription?: Subscription;
  private all: KitchenIngredientModel[] = [];

  constructor(private logger: LoggerService, private store: Store,
              private ingredientService: IngredientService,
              private recipeService: RecipeService
  ) {
    super(logger, 'kitchen', kitchenIngredientConverter);
  }

  async getListOrRefresh(): Promise<KitchenIngredientModel[]> {
    if (this.allSubscription) {
      this.allSubscription.unsubscribe();
    }
    if (this.all.length > 0 || this.refreshed) {
      return this.all;
    }

    return new Promise<KitchenIngredientModel[]>(resolve => {
      this.all$?.subscribe(async kitchenIngredients => {
        if (kitchenIngredients.length === 0 && !this.refreshed || this.storeIsOutdated()) {
          await this.refreshList();
        }

        this.all = [];
        for (const kitchenIngredient of kitchenIngredients) {
          const kitchenIngredientModel = new KitchenIngredientModel(kitchenIngredient);
          await this.hydrate(kitchenIngredientModel);
          this.all.push(kitchenIngredientModel);
        }
        this.all = ArrayHelper.sortBySlug<KitchenIngredientModel>(this.all);
        resolve(this.all);
      });
    });
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
    return kitchenIngredient ?? undefined;
  }

  async getById(id: string): Promise<KitchenIngredientModel | undefined> {
    const kitchenIngredients = await this.getListOrRefresh();
    const kitchenIngredient = kitchenIngredients.find((kitchenIngredient: KitchenIngredientModel) => {
      return kitchenIngredient.id === id;
    })!;
    return kitchenIngredient ?? undefined;
  }

  async get(slug: string): Promise<KitchenIngredientModel | undefined> {
    if (!slug) {
      return undefined;
    }

    let kitchenIngredient = await this.getBySlug(slug);
    if (!kitchenIngredient) {
      try {
        let kitchenIngredientData = await super.findOneBySlug(slug);
        return new KitchenIngredientModel(this.addToStore(kitchenIngredientData));
      } catch (e) {
        if (e instanceof DocumentNotFound) {
          return undefined;
        }
      }
    }
    return kitchenIngredient;
  }

  async add(kitchenIngredient: KitchenIngredientInterface): Promise<KitchenIngredientInterface | undefined> {
    const kitchenIngredientStored = await super.addOne(new KitchenIngredientModel(kitchenIngredient));
    return this.addToStore(kitchenIngredientStored);
  }

  async update(kitchenIngredient: KitchenIngredientInterface): Promise<KitchenIngredientInterface | undefined> {
    const kitchenIngredientStored = await super.updateOne(new KitchenIngredientModel(kitchenIngredient));
    this.store.dispatch(new UpdateKitchenIngredient(kitchenIngredientStored));
    return kitchenIngredientStored;
  }

  async remove(kitchenIngredient: KitchenIngredientInterface): Promise<void> {
    await super.removeOne(kitchenIngredient);
    this.store.dispatch(new RemoveKitchenIngredient(kitchenIngredient));
  }

  override async exist(name: string): Promise<boolean> {
    return await super.exist(name);
  }

  private async refreshList(): Promise<void> {
    const kitchenIngredients = await super.select(orderBy('slug'));

    this.store.dispatch(new FillKitchenIngredients(kitchenIngredients));
  }

  private addToStore(kitchenIngredient: KitchenIngredientInterface): KitchenIngredientInterface {
    this.store.dispatch(new AddKitchenIngredient(kitchenIngredient));
    return kitchenIngredient;
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


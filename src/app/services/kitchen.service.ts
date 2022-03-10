import { Injectable } from '@angular/core';
import { kitchenIngredientConverter } from '@converters';
import { DocumentNotFoundError } from '@errors';
import { KitchenIngredientInterface } from '@interfaces';
import { KitchenIngredientModel } from '@models';
import { Select, Store } from '@ngxs/store';
import { FirestoreService, IngredientService, LoggerService, RecipeService } from '@services';
import {
  AddKitchenIngredient,
  FillKitchenIngredients,
  KitchenIngredientState,
  RemoveKitchenIngredient,
  UpdateKitchenIngredient
} from '@stores';
import { ArrayHelper } from '@tools';
import { orderBy } from 'firebase/firestore';
import { first, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class KitchenIngredientService extends FirestoreService<KitchenIngredientInterface> {
  @Select(KitchenIngredientState.lastUpdated) override lastUpdated$?: Observable<Date>;
  @Select(KitchenIngredientState.all) protected override all$?: Observable<KitchenIngredientInterface[]>;

  private all: KitchenIngredientModel[] = [];
  private promise: Promise<KitchenIngredientModel[]> | undefined;

  constructor(private logger: LoggerService, private store: Store,
              private ingredientService: IngredientService,
              private recipeService: RecipeService
  ) {
    super(logger, 'kitchen', kitchenIngredientConverter);
  }

  async getListOrRefresh(): Promise<KitchenIngredientModel[]> {
    if (this.promise) {
      return this.promise;
    }

    if ((this.all.length > 0 || this.refreshed) && this.synchronized) {
      return this.all;
    }

    this.promise = new Promise<KitchenIngredientModel[]>(resolve => {
      this.all$?.pipe(first()).subscribe(async kitchenIngredients => {
        if (kitchenIngredients.length === 0 && !this.refreshed || this.storeIsOutdated()) {
          kitchenIngredients = await this.refreshList();
        }

        this.all = [];
        for (const kitchenIngredient of kitchenIngredients) {
          const kitchenIngredientModel = new KitchenIngredientModel(kitchenIngredient);
          await this.hydrate(kitchenIngredientModel);
          this.all.push(kitchenIngredientModel);
        }
        this.all = ArrayHelper.sortBy<KitchenIngredientModel>(this.all, 'slug');
        this.synchronized = true;
        resolve(this.all);
      });
    });
    return this.promise;
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
        if (e instanceof DocumentNotFoundError) {
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

  private async refreshList(): Promise<KitchenIngredientInterface[]> {
    const kitchenIngredients = await super.promiseQueryList(orderBy('slug'));

    this.store.dispatch(new FillKitchenIngredients(kitchenIngredients));
    return kitchenIngredients;
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


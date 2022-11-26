import {Injectable} from '@angular/core';
import {kitchenIngredientConverter} from '@converters';
import {DocumentNotFoundError} from '@errors';
import {KitchenIngredientInterface} from '@interfaces';
import {KitchenIngredientModel} from '@models';
import {Select, Store} from '@ngxs/store';
import {FirestoreService, IngredientService, LoggerService} from '@services';
import {
  AddKitchenIngredient,
  FillKitchenIngredients,
  KitchenIngredientState,
  RemoveKitchenIngredient,
  UpdateKitchenIngredient
} from '@stores';
import {ArrayHelper} from '@tools';
import {orderBy} from 'firebase/firestore';
import {first, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class KitchenIngredientService extends FirestoreService<KitchenIngredientInterface> {
  @Select(KitchenIngredientState.lastUpdated) override lastUpdated$?: Observable<Date>;

  // Données du store
  @Select(KitchenIngredientState.all) protected override all$?: Observable<KitchenIngredientInterface[]>;

  // Données du service
  private all: KitchenIngredientModel[] = [];

  constructor(private logger: LoggerService, private store: Store,
              private ingredientService: IngredientService,
  ) {
    super(logger, 'kitchen', kitchenIngredientConverter);
  }

  async getListOrRefresh(): Promise<KitchenIngredientModel[]> {
    return new Promise<KitchenIngredientModel[]>(async resolve => {
      // Si les données ont déjà été chargé dans le service
      if (this.loaded) {
        resolve(this.all);
      }
      // Sinon, si des données à jour sont dans le store
      else if (this.all$ && !this.storeIsOutdated()) {
        this.getAll$()?.pipe(first()).subscribe(async kitchenIngredients => {
          resolve(this.refreshList(kitchenIngredients));
        })

      }
      // Sinon on rafraichit le store
      else {
        const kitchenIngredients = await super.queryList(orderBy('slug'));
        this.store.dispatch(new FillKitchenIngredients(kitchenIngredients));

        resolve(this.refreshList(kitchenIngredients));
      }
    });
  }

  async refreshList(kitchenIngredients: KitchenIngredientInterface[]): Promise<KitchenIngredientModel[]> {
    this.all = [];
    for (const kitchenIngredient of kitchenIngredients) {
      const kitchenIngredientModel = new KitchenIngredientModel(kitchenIngredient);
      await this.hydrate(kitchenIngredientModel);
      this.all.push(kitchenIngredientModel);
    }
    this.all = ArrayHelper.sortBy<KitchenIngredientModel>(this.all, 'slug');
    this.loaded = true;

    return this.all;
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
        await this.addToStore(kitchenIngredientData);
        this.invalidLocalData();

        return new KitchenIngredientModel(kitchenIngredientData);
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

  private addToStore(kitchenIngredient: KitchenIngredientInterface): KitchenIngredientInterface {
    this.store.dispatch(new AddKitchenIngredient(kitchenIngredient));
    return kitchenIngredient;
  }

  private async hydrate(kitchenIngredient: KitchenIngredientModel): Promise<void> {
    if (kitchenIngredient.ingredientId) {
      kitchenIngredient.ingredient = await this.ingredientService.getById(kitchenIngredient.ingredientId);
    }
    delete kitchenIngredient.ingredientId;
  }
}


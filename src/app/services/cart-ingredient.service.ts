import {Injectable} from '@angular/core';
import {cartIngredientConverter} from '@converters';
import {DocumentNotFoundError} from '@errors';
import {CartIngredientInterface} from '@interfaces';
import {CartIngredientModel} from '@models';
import {Select, Store} from '@ngxs/store';
import {FirestoreService, IngredientService, LoggerService} from '@services';
import {
  AddCartIngredient,
  CartIngredientState,
  FillCartIngredients,
  RemoveCartIngredient,
  UpdateCartIngredient
} from '@stores';
import {ArrayHelper} from '@tools';
import {orderBy} from 'firebase/firestore';
import {first, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CartIngredientService extends FirestoreService<CartIngredientInterface> {
  @Select(CartIngredientState.lastUpdated) override lastUpdated$?: Observable<Date>;

  // Données du store
  @Select(CartIngredientState.all) protected override all$?: Observable<CartIngredientInterface[]>;

  // Données du service
  private all: CartIngredientModel[] = [];

  protected override maxHourOutdated = 0;

  constructor(private logger: LoggerService, private store: Store,
              private ingredientService: IngredientService,
  ) {
    super(logger, 'shopping', cartIngredientConverter);
  }

  async getListOrRefresh(): Promise<CartIngredientModel[]> {
    return new Promise<CartIngredientModel[]>(async resolve => {
      // Si les données ont déjà été chargé dans le service
      if (this.loaded) {
        resolve(this.all);
      }
      // Sinon, si des données à jour sont dans le store
      else if (this.all$ && !this.storeIsOutdated()) {
        this.getAll$()?.pipe(first()).subscribe(async cartIngredients => {
          resolve(this.refreshList(cartIngredients));
        })

      }
      // Sinon on rafraichit le store
      else {
        const cartIngredients = await super.queryList(orderBy('slug'));
        this.store.dispatch(new FillCartIngredients(cartIngredients));

        resolve(this.refreshList(cartIngredients));
      }
    });
  }

  async refreshList(cartIngredients: CartIngredientInterface[]): Promise<CartIngredientModel[]> {
    this.all = [];
    const all = [];

    for (const cartIngredient of cartIngredients) {
      const cartIngredientModel = new CartIngredientModel(cartIngredient);
      await this.hydrate(cartIngredientModel);
      all.push(cartIngredientModel);
    }

    this.all = ArrayHelper.sortBy<CartIngredientModel>(all, 'slug');
    this.loaded = true;

    return this.all;
  }

  async search(query: string): Promise<CartIngredientModel[]> {
    const cartIngredients = await this.getListOrRefresh();
    return cartIngredients.filter((cartIngredient: CartIngredientModel) => {
      return cartIngredient.ingredient?.nameContain(query);
    });
  }

  async getBySlug(slug: string): Promise<CartIngredientModel | undefined> {
    if (!slug) {
      return undefined;
    }

    const cartIngredients = await this.getListOrRefresh();
    const cartIngredient = cartIngredients.find((cartIngredient: CartIngredientModel) => {
      return cartIngredient.ingredient?.slug === slug;
    })!;

    if (!cartIngredient) {
      try {
        let cartIngredientData = await super.findOneBySlug(slug);
        await this.addToStore(cartIngredientData);
        this.invalidLocalData();

        return this.hydrate(new CartIngredientModel(cartIngredientData));
      } catch (e) {
        if (e instanceof DocumentNotFoundError) {
          return undefined;
        }
      }
    }
    return cartIngredient;
  }

  async add(cartIngredient: CartIngredientInterface): Promise<CartIngredientInterface | undefined> {
    const cartIngredientStored = await super.addOne(new CartIngredientModel(cartIngredient));
    return this.addToStore(cartIngredientStored);
  }

  async update(cartIngredient: CartIngredientInterface): Promise<CartIngredientInterface | undefined> {
    const cartIngredientStored = await super.updateOne(new CartIngredientModel(cartIngredient));
    this.store.dispatch(new UpdateCartIngredient(cartIngredientStored));
    return cartIngredientStored;
  }

  async remove(cartIngredient: CartIngredientInterface): Promise<void> {
    await super.removeOne(cartIngredient);
    this.store.dispatch(new RemoveCartIngredient(cartIngredient));
  }

  override async exist(name: string): Promise<boolean> {
    return await super.exist(name);
  }

  private addToStore(cartIngredient: CartIngredientInterface): CartIngredientInterface {
    this.store.dispatch(new AddCartIngredient(cartIngredient));
    return cartIngredient;
  }

  private async hydrate(cartIngredient: CartIngredientModel): Promise<CartIngredientModel> {
    if (cartIngredient.ingredientId) {
      cartIngredient.ingredient = await this.ingredientService.getById(cartIngredient.ingredientId);
    }
    delete cartIngredient.ingredientId;

    return cartIngredient;
  }
}


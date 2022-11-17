import { TestBed } from '@angular/core/testing';
import { DocumentNotFoundError } from '@errors';
import {
  ingredientLegumineMock,
  kitchenIngredientLegumineMock,
  kitchenIngredientMeatMock,
  kitchenIngredientRecipeMock,
  kitchenIngredientVegetableFatMock,
  kitchenIngredientVegetableMock,
  recipeLegumineMock
} from '@mocks';
import { KitchenIngredientModel } from '@models';
import { NgxsModule, Store } from '@ngxs/store';
import { FirestoreService, IngredientService, KitchenIngredientService, LoggerService, RecipeService } from '@services';
import { KitchenIngredientState } from '@stores';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';


describe('KitchenIngredientService', () => {
  let service: KitchenIngredientService;
  let ingredientService: IngredientService;
  let recipeService: RecipeService;
  let store: Store;
  let loggerService: LoggerService;
  let kitchenIngredients: KitchenIngredientModel[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ KitchenIngredientState ], {
          developmentMode: true
        })
      ],
      providers: [
        MockProvider(LoggerService),
        MockProvider(IngredientService),
        MockProvider(RecipeService),
      ]
    });
    service = TestBed.inject(KitchenIngredientService);
    ingredientService = TestBed.inject(IngredientService);
    recipeService = TestBed.inject(RecipeService);
    store = TestBed.inject(Store);
    loggerService = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*describe('KitchenIngredientService.getListOrRefresh', () => {
    let spyAll: jest.SpyInstance;
    const kitchenIngredientsExisting = [ kitchenIngredientRecipeMock ];
    const kitchenIngredientsMocked = [ kitchenIngredientLegumineMock, kitchenIngredientMeatMock, kitchenIngredientVegetableMock ];

    beforeEach(() => {
      service['refreshList'] = jest.fn();
      (service['refreshList'] as jest.Mock).mockReturnValue(kitchenIngredientsMocked);
    });

    it('should return promise', async () => {
      kitchenIngredients = [ kitchenIngredientMeatMock ];
      service['promise'] = Promise.resolve(kitchenIngredients);

      expect(await service.getListOrRefresh()).toBe(kitchenIngredients);
    });

    describe('should return all if', () => {
      beforeEach(() => {
        spyAll = jest.spyOn(service, 'getAll$').mockReturnValue(undefined);
        service['synchronized'] = true;

        kitchenIngredients = [ kitchenIngredientLegumineMock ];
        service['all'] = kitchenIngredients;
      });

      it('synchronized and not empty list', async () => {
        service['refreshed'] = false;

        expect(await service.getListOrRefresh()).toBe(kitchenIngredients);
        expect(spyAll).not.toHaveBeenCalled();
      });

      it('synchronized & refreshed & empty list', async () => {
        kitchenIngredients = [];
        service['all'] = kitchenIngredients;
        service['refreshed'] = true;

        expect(await service.getListOrRefresh()).toBe(kitchenIngredients);
        expect(spyAll).not.toHaveBeenCalled();
      });

      it('not synchronized & no observable', async () => {
        service['synchronized'] = false;

        expect(await service.getListOrRefresh()).toBe(kitchenIngredients);
        expect(spyAll).toHaveBeenCalled();
      });
    });

    describe('should refresh list', () => {
      const kitchenIngredientsExpected = [ kitchenIngredientLegumineMock, kitchenIngredientMeatMock, kitchenIngredientVegetableMock ];

      beforeEach(() => {
        service['synchronized'] = false;
      });

      it('if not refreshed', async () => {
        spyAll = jest.spyOn(service, 'getAll$').mockReturnValue(of([]));
        service['refreshed'] = false;

        expect(await service.getListOrRefresh()).toEqual(kitchenIngredientsExpected);
        expect(service['synchronized']).toBe(true);
        expect(spyAll).toHaveBeenCalled();
      });

      it('if outdated', async () => {
        spyAll = jest.spyOn(service, 'getAll$').mockReturnValue(of(kitchenIngredientsExisting));
        service['lastUpdated'] = undefined;

        expect(await service.getListOrRefresh()).toEqual(kitchenIngredientsExpected);
        expect(service['synchronized']).toBe(true);
        expect(spyAll).toHaveBeenCalled();
      });
    });

    describe('should not refresh list if updated', () => {
      beforeEach(() => {
        service['lastUpdated'] = new Date();
      });

      it('and not empty and not refreshed', async () => {
        spyAll = jest.spyOn(service, 'getAll$').mockReturnValue(of(kitchenIngredientsExisting));
        service['refreshed'] = false;

        expect(await service.getListOrRefresh()).toEqual(kitchenIngredientsExisting);

        expect(service['synchronized']).toBe(true);
        expect(spyAll).toHaveBeenCalled();
        expect(service['refreshList']).not.toHaveBeenCalled();
      });

      it('and empty and refreshed', async () => {
        spyAll = jest.spyOn(service, 'getAll$').mockReturnValue(of([]));
        service['refreshed'] = true;

        expect(await service.getListOrRefresh()).toEqual([]);

        expect(service['synchronized']).toBe(true);
        expect(spyAll).toHaveBeenCalled();
        expect(service['refreshList']).not.toHaveBeenCalled();
      });
    });
  });
*/

  describe('after list', () => {
    const kitchenIngredientsMocked = [ kitchenIngredientLegumineMock, kitchenIngredientVegetableMock, kitchenIngredientMeatMock ];

    beforeEach(() => {
      jest.spyOn(service, 'getListOrRefresh').mockResolvedValue(kitchenIngredientsMocked);
    });

    describe('KitchenIngredientService.search', () => {
      it('should return element', async () => {
        expect(await service.search('Vegetable')).toEqual([ kitchenIngredientVegetableMock ]);
      });
    });

    describe('KitchenIngredientService.getBySlug', () => {
      it('should return element', async () => {
        expect(await service.getBySlug(kitchenIngredientMeatMock.slug!)).toEqual(kitchenIngredientMeatMock);
      });

      it('should return undefined', async () => {
        expect(await service.getBySlug(kitchenIngredientVegetableFatMock.slug!)).toBe(undefined);
      });
    });

    describe('KitchenIngredientService.getById', () => {
      it('should return element', async () => {
        expect(await service.getById(kitchenIngredientMeatMock.id!)).toEqual(kitchenIngredientMeatMock);
      });

      it('should return undefined', async () => {
        expect(await service.getById(kitchenIngredientVegetableFatMock.slug!)).toBe(undefined);
      });
    });

    describe('KitchenIngredientService.get', () => {
      beforeEach(() => {
        FirestoreService.prototype['findOneBySlug'] = jest.fn();
        (FirestoreService.prototype['findOneBySlug'] as jest.Mock).mockResolvedValue(kitchenIngredientVegetableFatMock);
      });

      it('should return undefined if no name', async () => {
        expect(await service.get('')).toBe(undefined);
      });

      it('should call findOneBySlug if slug exist', async () => {
        expect(await service.get(kitchenIngredientLegumineMock.slug!)).toEqual(kitchenIngredientLegumineMock);
      });

      it('should call findOneBySlug if slug don\'t exist', async () => {
        expect(await service.get(kitchenIngredientVegetableFatMock.slug!)).toEqual(kitchenIngredientVegetableFatMock);
        expect(FirestoreService.prototype['findOneBySlug']).toBeCalledWith(kitchenIngredientVegetableFatMock.slug);
      });

      it('should return undefined if not found', async () => {
        const error = new DocumentNotFoundError('test');
        (FirestoreService.prototype['findOneBySlug'] as jest.Mock).mockRejectedValue(error);

        expect(await service.get(kitchenIngredientVegetableFatMock.slug!)).toBe(undefined);
      });
    });
  });

  describe('KitchenIngredientService.add', () => {
    let storeSpy: jest.SpyInstance;

    beforeEach(() => {
      FirestoreService.prototype['addOne'] = jest.fn();
      (FirestoreService.prototype['addOne'] as jest.Mock).mockResolvedValue(kitchenIngredientVegetableFatMock);
      storeSpy = jest.spyOn(store, 'dispatch');
    });

    it('should store kitchenIngredient', async () => {
      expect(await service.add(kitchenIngredientVegetableFatMock)).toEqual(kitchenIngredientVegetableFatMock);
      expect(storeSpy).toHaveBeenCalledWith({payload: kitchenIngredientVegetableFatMock});
    });
  });

  describe('KitchenIngredientService.update', () => {
    let storeSpy: jest.SpyInstance;

    beforeEach(() => {
      FirestoreService.prototype['updateOne'] = jest.fn();
      (FirestoreService.prototype['updateOne'] as jest.Mock).mockResolvedValue(kitchenIngredientVegetableFatMock);
      storeSpy = jest.spyOn(store, 'dispatch');
    });

    it('should store kitchenIngredient', async () => {
      expect(await service.update(kitchenIngredientVegetableFatMock)).toEqual(kitchenIngredientVegetableFatMock);
      expect(storeSpy).toHaveBeenCalledWith({payload: kitchenIngredientVegetableFatMock});
    });
  });

  describe('KitchenIngredientService.remove', () => {
    let storeSpy: jest.SpyInstance;

    beforeEach(() => {
      FirestoreService.prototype['removeOne'] = jest.fn();
      (FirestoreService.prototype['removeOne'] as jest.Mock).mockResolvedValue(kitchenIngredientVegetableFatMock);
      storeSpy = jest.spyOn(store, 'dispatch');
    });

    it('should store kitchenIngredient', async () => {
      await service.remove(kitchenIngredientVegetableFatMock);
      expect(storeSpy).toHaveBeenCalledWith({payload: kitchenIngredientVegetableFatMock});
    });
  });

  describe('KitchenIngredientService.exist', () => {
    beforeEach(() => {
      FirestoreService.prototype['exist'] = jest.fn();
      (FirestoreService.prototype['exist'] as jest.Mock).mockResolvedValue(true);
    });

    it('should store kitchenIngredient', async () => {
      expect(await service.exist(kitchenIngredientVegetableFatMock.name!)).toEqual(true);
    });
  });

  /*describe('KitchenIngredientService.refreshList', () => {
    let storeSpy: jest.SpyInstance;
    const kitchenIngredients = [ kitchenIngredientVegetableFatMock ];

    beforeEach(() => {
      FirestoreService.prototype['promiseQueryList'] = jest.fn();
      (FirestoreService.prototype['promiseQueryList'] as jest.Mock).mockResolvedValue(kitchenIngredients);
      storeSpy = jest.spyOn(store, 'dispatch');
    });

    it('should store kitchenIngredient', async () => {
      expect(await service['refreshList']()).toEqual(kitchenIngredients);
      expect(storeSpy).toHaveBeenCalledWith({payload: kitchenIngredients});
    });
  });*/

  describe('KitchenIngredientService.hydrate', () => {
    beforeEach(() => {
      ingredientService.getById = jest.fn();
      (ingredientService.getById as jest.Mock).mockResolvedValue(ingredientLegumineMock);

      recipeService.getById = jest.fn();
      (recipeService.getById as jest.Mock).mockResolvedValue(recipeLegumineMock);
    });

    it('should hydrate', async () => {
      const kitchenIngredientVeganMockNotHydrated = new KitchenIngredientModel({
        id: 'kitchenIngredientVeganId1',
        name: 'KitchenIngredient Vegan 1',
        slug: 'kitchenIngredient-vegan-1',
        recipeId: recipeLegumineMock.id,
        ingredientId: ingredientLegumineMock.id,
      });

      const kitchenIngredientVeganMockHydrated = new KitchenIngredientModel({
        id: 'kitchenIngredientVeganId1',
        name: 'KitchenIngredient Vegan 1',
        slug: 'kitchenIngredient-vegan-1',
        recipe: recipeLegumineMock,
        ingredient: ingredientLegumineMock,
      });

      await service['hydrate'](kitchenIngredientVeganMockNotHydrated);

      expect(kitchenIngredientVeganMockNotHydrated).toEqual(kitchenIngredientVeganMockHydrated);
    });
  });
});

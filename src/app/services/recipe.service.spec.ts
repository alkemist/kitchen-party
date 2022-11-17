import { TestBed } from '@angular/core/testing';
import { DocumentNotFoundError } from '@errors';
import {
  ingredientLegumineMock,
  recipeLegumineMock,
  recipeMeatMock,
  recipeVegeMock,
  recipeVegetableMock
} from '@mocks';
import { RecipeModel } from '@models';
import { NgxsModule, Store } from '@ngxs/store';
import { FirestoreService, IngredientService, LoggerService, RecipeService } from '@services';
import { RecipeState } from '@stores';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';


describe('RecipeService', () => {
  let service: RecipeService;
  let ingredientService: IngredientService;
  let store: Store;
  let loggerService: LoggerService;
  let recipes: RecipeModel[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ RecipeState ], {
          developmentMode: true
        })
      ],
      providers: [
        MockProvider(LoggerService),
      ]
    });
    service = TestBed.inject(RecipeService);
    ingredientService = TestBed.inject(IngredientService);
    store = TestBed.inject(Store);
    loggerService = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*describe('RecipeService.getListOrRefresh', () => {
    let spyAll: jest.SpyInstance;
    const recipesExisting = [ recipeLegumineMock ];
    const recipesMocked = [ recipeLegumineMock, recipeVegetableMock, recipeMeatMock ];

    beforeEach(() => {
      service['refreshList'] = jest.fn();
      (service['refreshList'] as jest.Mock).mockReturnValue(recipesMocked);
    });

    it('should return promise', async () => {
      recipes = [ recipeMeatMock ];
      service['promise'] = Promise.resolve(recipes);

      expect(await service.getListOrRefresh()).toBe(recipes);
    });

    describe('should return all if', () => {
      beforeEach(() => {
        spyAll = jest.spyOn(service, 'getAll$').mockReturnValue(undefined);
        service['synchronized'] = true;

        recipes = [ recipeLegumineMock ];
        service['all'] = recipes;
      });

      it('synchronized and not empty list', async () => {
        service['refreshed'] = false;

        expect(await service.getListOrRefresh()).toBe(recipes);
        expect(spyAll).not.toHaveBeenCalled();
      });

      it('synchronized & refreshed & empty list', async () => {
        recipes = [];
        service['all'] = recipes;
        service['refreshed'] = true;

        expect(await service.getListOrRefresh()).toBe(recipes);
        expect(spyAll).not.toHaveBeenCalled();
      });

      it('not synchronized & no observable', async () => {
        service['synchronized'] = false;

        expect(await service.getListOrRefresh()).toBe(recipes);
        expect(spyAll).toHaveBeenCalled();
      });
    });

    describe('should refresh list', () => {
      const recipesExpected = [ recipeLegumineMock, recipeMeatMock, recipeVegetableMock ];

      beforeEach(() => {
        service['synchronized'] = false;
      });

      it('if not refreshed', async () => {
        spyAll = jest.spyOn(service, 'getAll$').mockReturnValue(of([]));
        service['refreshed'] = false;

        expect(await service.getListOrRefresh()).toEqual(recipesExpected);
        expect(service['synchronized']).toBe(true);
        expect(spyAll).toHaveBeenCalled();
      });

      it('if outdated', async () => {
        spyAll = jest.spyOn(service, 'getAll$').mockReturnValue(of(recipesExisting));
        service['lastUpdated'] = undefined;

        expect(await service.getListOrRefresh()).toEqual(recipesExpected);
        expect(service['synchronized']).toBe(true);
        expect(spyAll).toHaveBeenCalled();
      });
    });

    describe('should not refresh list if updated', () => {
      beforeEach(() => {
        service['lastUpdated'] = new Date();
      });

      it('and not empty and not refreshed', async () => {
        spyAll = jest.spyOn(service, 'getAll$').mockReturnValue(of(recipesExisting));
        service['refreshed'] = false;

        expect(await service.getListOrRefresh()).toEqual(recipesExisting);

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
    const recipesMocked = [ recipeLegumineMock, recipeVegetableMock, recipeMeatMock ];

    beforeEach(() => {
      jest.spyOn(service, 'getListOrRefresh').mockResolvedValue(recipesMocked);
    });

    describe('RecipeService.search', () => {
      it('should return element', async () => {
        expect(await service.search('Vegetable')).toEqual([ recipeVegetableMock ]);
      });
    });

    describe('RecipeService.getBySlug', () => {
      it('should return element', async () => {
        expect(await service.getBySlug(recipeMeatMock.slug)).toEqual(recipeMeatMock);
      });

      it('should return undefined', async () => {
        expect(await service.getBySlug(recipeVegeMock.slug)).toBe(undefined);
      });
    });

    describe('RecipeService.getById', () => {
      it('should return element', async () => {
        expect(await service.getById(recipeMeatMock.id!)).toEqual(recipeMeatMock);
      });

      it('should return undefined', async () => {
        expect(await service.getById(recipeVegeMock.slug)).toBe(undefined);
      });
    });

    describe('RecipeService.get', () => {
      beforeEach(() => {
        FirestoreService.prototype['findOneBySlug'] = jest.fn();
        (FirestoreService.prototype['findOneBySlug'] as jest.Mock).mockResolvedValue(recipeVegeMock);
      });

      it('should return undefined if no name', async () => {
        expect(await service.get('')).toBe(undefined);
      });

      it('should call findOneBySlug if slug exist', async () => {
        expect(await service.get(recipeLegumineMock.slug)).toEqual(recipeLegumineMock);
      });

      it('should call findOneBySlug if slug don\'t exist', async () => {
        expect(await service.get(recipeVegeMock.slug)).toEqual(recipeVegeMock);
        expect(FirestoreService.prototype['findOneBySlug']).toBeCalledWith(recipeVegeMock.slug);
      });

      it('should return undefined if not found', async () => {
        const error = new DocumentNotFoundError('test');
        (FirestoreService.prototype['findOneBySlug'] as jest.Mock).mockRejectedValue(error);

        expect(await service.get(recipeVegeMock.slug)).toBe(undefined);
      });
    });
  });

  describe('RecipeService.add', () => {
    let storeSpy: jest.SpyInstance;

    beforeEach(() => {
      FirestoreService.prototype['addOne'] = jest.fn();
      (FirestoreService.prototype['addOne'] as jest.Mock).mockResolvedValue(recipeVegeMock);
      storeSpy = jest.spyOn(store, 'dispatch');
    });

    it('should store recipe', async () => {
      expect(await service.add(recipeVegeMock)).toEqual(recipeVegeMock);
      expect(storeSpy).toHaveBeenCalledWith({payload: recipeVegeMock});
    });
  });

  describe('RecipeService.update', () => {
    let storeSpy: jest.SpyInstance;

    beforeEach(() => {
      FirestoreService.prototype['updateOne'] = jest.fn();
      (FirestoreService.prototype['updateOne'] as jest.Mock).mockResolvedValue(recipeVegeMock);
      storeSpy = jest.spyOn(store, 'dispatch');
    });

    it('should store recipe', async () => {
      expect(await service.update(recipeVegeMock)).toEqual(recipeVegeMock);
      expect(storeSpy).toHaveBeenCalledWith({payload: recipeVegeMock});
    });
  });

  describe('RecipeService.remove', () => {
    let storeSpy: jest.SpyInstance;

    beforeEach(() => {
      FirestoreService.prototype['removeOne'] = jest.fn();
      (FirestoreService.prototype['removeOne'] as jest.Mock).mockResolvedValue(recipeVegeMock);
      storeSpy = jest.spyOn(store, 'dispatch');
    });

    it('should store recipe', async () => {
      await service.remove(recipeVegeMock);
      expect(storeSpy).toHaveBeenCalledWith({payload: recipeVegeMock});
    });
  });

  describe('RecipeService.exist', () => {
    beforeEach(() => {
      FirestoreService.prototype['exist'] = jest.fn();
      (FirestoreService.prototype['exist'] as jest.Mock).mockResolvedValue(true);
    });

    it('should store recipe', async () => {
      expect(await service.exist(recipeVegeMock.name)).toEqual(true);
    });
  });

  /*describe('RecipeService.refreshList', () => {
    let storeSpy: jest.SpyInstance;
    const recipes = [ recipeVegeMock ];

    beforeEach(() => {
      FirestoreService.prototype['promiseQueryList'] = jest.fn();
      (FirestoreService.prototype['promiseQueryList'] as jest.Mock).mockResolvedValue(recipes);
      storeSpy = jest.spyOn(store, 'dispatch');
    });

    it('should store recipe', async () => {
      expect(await service['refreshList']()).toEqual(recipes);
      expect(storeSpy).toHaveBeenCalledWith({payload: recipes});
    });
  });*/

  describe('RecipeService.hydrate', () => {
    beforeEach(() => {
      ingredientService.getById = jest.fn();
      (ingredientService.getById as jest.Mock).mockResolvedValue(ingredientLegumineMock);
    });

    it('should hydrate', async () => {
      const recipesMocked = [ recipeLegumineMock ];

      const recipeVeganMockNotHydrated = new RecipeModel({
        id: 'recipeVeganId1',
        name: 'Recipe Vegan 1',
        slug: 'recipe-vegan-1',
        recipeIngredients: [
          {
            recipeId: recipeLegumineMock.id,
          },
          {
            ingredientId: ingredientLegumineMock.id,
          },
        ]
      });

      const recipeVeganMockHydrated = new RecipeModel({
        id: 'recipeVeganId1',
        name: 'Recipe Vegan 1',
        slug: 'recipe-vegan-1',
        recipeIngredients: [
          {
            recipe: recipeLegumineMock,
          },
          {
            ingredient: ingredientLegumineMock,
          },
        ]
      });

      await service['hydrate'](recipeVeganMockNotHydrated, recipesMocked);

      expect(recipeVeganMockNotHydrated).toEqual(recipeVeganMockHydrated);
    });
  });
});

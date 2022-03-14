import { TestBed } from '@angular/core/testing';
import { ingredientAnimalFatMock, ingredientLegumineMock, ingredientMeatMock, ingredientVegetableMock } from '@mocks';
import { IngredientModel } from '@models';
import { NgxsModule, Store } from '@ngxs/store';

import { IngredientService, LoggerService } from '@services';
import { IngredientState } from '@stores';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';


describe('IngredientService', () => {
  let service: IngredientService;
  let store: Store;
  let loggerService: LoggerService;
  let ingredients: IngredientModel[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ IngredientState ], {
          developmentMode: true
        })
      ],
      providers: [
        MockProvider(LoggerService),
      ]
    });
    service = TestBed.inject(IngredientService);
    store = TestBed.inject(Store);
    loggerService = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('IngredientService.getListOrRefresh', () => {
    let spyAll: jest.SpyInstance;
    const ingredientsExisting = [ ingredientLegumineMock ];
    const ingredientsMocked = [ ingredientLegumineMock, ingredientVegetableMock, ingredientMeatMock ];

    beforeEach(() => {
      service['refreshList'] = jest.fn();
      (service['refreshList'] as jest.Mock).mockReturnValue(ingredientsMocked);
    });

    it('should return promise', async () => {
      ingredients = [ ingredientMeatMock ];
      service['promise'] = Promise.resolve(ingredients);

      expect(await service.getListOrRefresh()).toBe(ingredients);
    });

    describe('should return all if', () => {
      beforeEach(() => {
        spyAll = jest.spyOn(service, 'getAll$').mockReturnValue(undefined);
        service['synchronized'] = true;

        ingredients = [ ingredientLegumineMock ];
        service['all'] = ingredients;
      });

      it('synchronized and not empty list', async () => {
        service['refreshed'] = false;

        expect(await service.getListOrRefresh()).toBe(ingredients);
        expect(spyAll).not.toHaveBeenCalled();
      });

      it('synchronized & refreshed & empty list', async () => {
        ingredients = [];
        service['all'] = ingredients;
        service['refreshed'] = true;

        expect(await service.getListOrRefresh()).toBe(ingredients);
        expect(spyAll).not.toHaveBeenCalled();
      });

      it('not synchronized & no observable', async () => {
        service['synchronized'] = false;

        expect(await service.getListOrRefresh()).toBe(ingredients);
        expect(spyAll).toHaveBeenCalled();
      });
    });

    describe('should refresh list', () => {
      const ingredientsExpected = [ ingredientLegumineMock, ingredientMeatMock, ingredientVegetableMock ];

      beforeEach(() => {
        service['synchronized'] = false;
      });

      it('if not refreshed', async () => {
        spyAll = jest.spyOn(service, 'getAll$').mockReturnValue(of([]));
        service['refreshed'] = false;

        expect(await service.getListOrRefresh()).toEqual(ingredientsExpected);
        expect(service['synchronized']).toBe(true);
        expect(spyAll).toHaveBeenCalled();
      });

      it('if outdated', async () => {
        spyAll = jest.spyOn(service, 'getAll$').mockReturnValue(of(ingredientsExisting));
        service['lastUpdated'] = undefined;

        expect(await service.getListOrRefresh()).toEqual(ingredientsExpected);
        expect(service['synchronized']).toBe(true);
        expect(spyAll).toHaveBeenCalled();
      });
    });

    describe('should not refresh list if updated', () => {
      beforeEach(() => {
        service['lastUpdated'] = new Date();
      });

      it('and not empty and not refreshed', async () => {
        spyAll = jest.spyOn(service, 'getAll$').mockReturnValue(of(ingredientsExisting));
        service['refreshed'] = false;

        expect(await service.getListOrRefresh()).toEqual(ingredientsExisting);

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

  describe('after list', () => {
    const ingredientsMocked = [ ingredientLegumineMock, ingredientVegetableMock, ingredientMeatMock ];

    beforeEach(() => {
      jest.spyOn(service, 'getListOrRefresh').mockResolvedValue(ingredientsMocked);
    });

    describe('IngredientService.search', () => {
      it('should return element', async () => {
        expect(await service.search('Vegetable')).toEqual([ ingredientVegetableMock ]);
      });
    });

    describe('IngredientService.getBySlug', () => {
      it('should return element', async () => {
        expect(await service.getBySlug(ingredientMeatMock.slug)).toEqual(ingredientMeatMock);
      });

      it('should return undefined', async () => {
        expect(await service.getBySlug(ingredientAnimalFatMock.slug)).toBe(undefined);
      });
    });

    describe('IngredientService.getById', () => {
      it('should return element', async () => {
        expect(await service.getById(ingredientMeatMock.id!)).toEqual(ingredientMeatMock);
      });

      it('should return undefined', async () => {
        expect(await service.getById(ingredientAnimalFatMock.slug)).toBe(undefined);
      });
    });

    xdescribe('IngredientService.get', () => {
      beforeEach(() => {
        // Trouver comment mocker le super.findOneBySlug (la classe parente)
        service['findOneBySlug'] = jest.fn();
        (service['findOneBySlug'] as jest.Mock).mockResolvedValue(ingredientAnimalFatMock);
      });

      it('should return undefined if no name', async () => {
        expect(await service.get('')).toBe(undefined);
      });

      /*xit('should return undefined if not found', async () => {
        const error = new DocumentNotFoundError('test');
        (service['findOneBySlug'] as jest.Mock).mockRejectedValue(error);

        expect(await service.get(ingredientAnimalFatMock.slug)).toBe(undefined);
      });*/

      it('should call findOneBySlug if slug don\'t exist', async () => {
        await service.get(ingredientAnimalFatMock.slug);
        //expect(await service.get(ingredientAnimalFatMock.slug)).toBe(ingredientAnimalFatMock);
        expect(service['findOneBySlug']).toBeCalledWith(ingredientAnimalFatMock.slug);
      });

      it('should force refresh', async () => {
        expect(await service.get(ingredientMeatMock.slug, true)).toBe(ingredientAnimalFatMock);
        expect(service['findOneBySlug']).toBeCalledWith(ingredientMeatMock.slug);
      });
    });
  });


  xdescribe('IngredientService.add', () => {

  });

  xdescribe('IngredientService.update', () => {

  });

  xdescribe('IngredientService.remove', () => {

  });

  xdescribe('IngredientService.addToStore', () => {

  });

  xdescribe('IngredientService.refreshList', () => {

  });
});

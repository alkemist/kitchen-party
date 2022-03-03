import {
  ingredientTypeFishMap,
  ingredientTypeMeatMap,
  ingredientTypeVeganMap,
  ingredientTypeVegeMap
} from '../consts/ingredient-type-diet.const';
import { IngredientTypeIconEnum, IngredientTypeKeyEnum, IngredientTypeLabelEnum } from '../enums';
import { IngredientFormInterface, IngredientInterface } from '../interfaces';
import { dateMock } from '../mocks/date.mock';
import { EnumHelper } from '../tools';
import { IngredientModel } from './ingredient.model';

describe('IngredientModel', () => {
  describe('IngredientModel.constructor', () => {
    it('should contain isLiquid boolean value', () => {
      expect(new IngredientModel({isLiquid: true} as IngredientInterface)).toMatchObject({isLiquid: true});
    });

    it('should contain isLiquid null value', () => {
      expect(new IngredientModel({} as IngredientInterface)).toMatchObject({isLiquid: null});
    });
  });
  describe('IngredientModel.typeName', () => {
    it('should return type name', () => {
      expect(new IngredientModel({type: IngredientTypeKeyEnum.meats} as IngredientInterface).typeName).toBe(IngredientTypeLabelEnum.meats);
    });
  });
  describe('IngredientModel.typeIcon', () => {
    it('should return icons', () => {
      const icons = EnumHelper.enumToAssociativArray(IngredientTypeIconEnum);
      const keys = Object.keys(IngredientTypeKeyEnum);

      for (const key of keys) {
        expect(new IngredientModel({type: key} as IngredientInterface).typeIcon).toBe(icons[key]);
      }

      expect.assertions(keys.length);
    });
  });
  describe('IngredientModel.format', () => {
    it('should format ingredient date', () => {
      expect(IngredientModel.format({
        dateBegin: dateMock,
        dateEnd: dateMock,
      } as IngredientFormInterface))
        .toEqual(new IngredientModel({
          monthBegin: 8,
          monthEnd: 8,
        } as IngredientInterface));
    });
  });
  describe('IngredientModel.nameContain', () => {
    it('should return true if name contain searched word', () => {
      expect(new IngredientModel({name: 'ceci est un test', slug: 'rien'} as IngredientInterface)
        .nameContain('test')).toBe(true);
    });

    it('should return true if slug contain searched word', () => {
      expect(new IngredientModel({name: 'rien', slug: 'ceci est un test'} as IngredientInterface)
        .nameContain('test')).toBe(true);
    });

    it('should return true if name and slug slug contain searched word', () => {
      expect(new IngredientModel({name: 'test test', slug: 'ceci est un test'} as IngredientInterface)
        .nameContain('test')).toBe(true);
    });

    it('should return false if name and slug don\'t contain searched word', () => {
      expect(new IngredientModel({name: 'rien', slug: 'nothing'} as IngredientInterface)
        .nameContain('test')).toBe(false);
    });
  });
  describe('IngredientModel.hydrate', () => {
    it('should hydrate', () => {
      const id = '3';
      const hydratedValues = {
        name: 'name',
        slug: 'slug',
        type: IngredientTypeKeyEnum.salts,
        isLiquid: true,
      } as IngredientInterface;
      const objectToHydrated = new IngredientModel({name: 'test', id} as IngredientInterface);

      objectToHydrated.hydrate(hydratedValues);

      expect(objectToHydrated).toEqual({...hydratedValues, id});
    });
  });
  describe('IngredientModel.isMeat', () => {
    it('should return true if ingredient is meat', () => {
      ingredientTypeMeatMap.forEach(((value, key) => {
        expect(new IngredientModel({type: key} as IngredientInterface).isMeat()).toBe(value);
      }));

      expect.assertions(ingredientTypeMeatMap.size);
    });
  });
  describe('IngredientModel.isFish', () => {
    it('should return true if ingredient is fish', () => {
      ingredientTypeFishMap.forEach(((value, key) => {
        expect(new IngredientModel({type: key} as IngredientInterface).isFish()).toBe(value);
      }));

      expect.assertions(ingredientTypeMeatMap.size);
    });
  });
  describe('IngredientModel.isVege', () => {
    it('should return true if ingredient is vegan', () => {
      ingredientTypeVegeMap.forEach(((value, key) => {
        expect(new IngredientModel({type: key} as IngredientInterface).isVege()).toBe(value);
      }));

      expect.assertions(ingredientTypeVegeMap.size);
    });
  });
  describe('IngredientModel.isVegan', () => {
    it('should return true if ingredient is vegan', () => {
      ingredientTypeVeganMap.forEach(((value, key) => {
        expect(new IngredientModel({type: key} as IngredientInterface).isVegan()).toBe(value);
      }));

      expect.assertions(ingredientTypeVeganMap.size);
    });
  });
  describe('IngredientModel.isSweet', () => {
    it('should return true if ingredient is sweet', () => {
      expect(new IngredientModel({name: 'Chocolat'} as IngredientInterface).isSweet()).toBe(true);
    });

    it('should return true if ingredient is not sweet', () => {
      expect(new IngredientModel({name: 'Courgette'} as IngredientInterface).isSweet()).toBe(false);
    });
  });
  describe('IngredientModel.isSalty', () => {
    it('should return true if ingredient is fish', () => {
      expect(new IngredientModel({
        name: '',
        type: IngredientTypeKeyEnum.fishes_seafoods
      } as IngredientInterface).isSalty()).toBe(true);
    });

    it('should return true if ingredient is meat', () => {
      expect(new IngredientModel({
        name: '',
        type: IngredientTypeKeyEnum.meats
      } as IngredientInterface).isSalty()).toBe(true);
    });

    it('should return true if ingredient is salty', () => {
      expect(new IngredientModel({name: 'Tomate'} as IngredientInterface).isSalty()).toBe(true);
      expect(new IngredientModel({name: 'Bouillon de légume'} as IngredientInterface).isSalty()).toBe(true);
    });

    it('should return false else', () => {
      expect(new IngredientModel({name: ''} as IngredientInterface).isSalty()).toBe(false);
    });
  });
  describe('IngredientModel.isSeason', () => {
    jest
      .useFakeTimers()
      .setSystemTime(dateMock);

    it('should return true if ingredient is season', () => {
      const testsSeason = [
        [ 8, 8 ],
        [ 8, 9 ],
        [ 7, 8 ],
        [ 6, 9 ],
        [ 8, 1 ],
        [ 9, 8 ],
        [ 7, 1 ],
      ];

      for (const testSeason of testsSeason) {
        expect(new IngredientModel({
          type: IngredientTypeKeyEnum.fruits_vegetables_mushrooms,
          monthBegin: testSeason[0],
          monthEnd: testSeason[1],
        } as IngredientInterface).isSeason()).toBe(true);
      }

      expect.assertions(testsSeason.length);
    });
    it('should return true if ingredient is not season', () => {
      const testsSeason = [
        [ 9, 7 ],
        [ 9, 12 ],
        [ 1, 7 ],
      ];

      for (const testSeason of testsSeason) {
        expect(new IngredientModel({
          type: IngredientTypeKeyEnum.fruits_vegetables_mushrooms,
          monthBegin: testSeason[0],
          monthEnd: testSeason[1],
        } as IngredientInterface).isSeason()).toBe(false);
      }

      expect.assertions(testsSeason.length);
    });
    it('should return true if ingredient has not season', () => {
      expect(new IngredientModel({} as IngredientInterface).isSeason()).toBe(true);
      expect(new IngredientModel({
        monthBegin: 1,
        monthEnd: 12, type: IngredientTypeKeyEnum.alcohols
      } as IngredientInterface).isSeason()).toBe(true);
    });
  });
});

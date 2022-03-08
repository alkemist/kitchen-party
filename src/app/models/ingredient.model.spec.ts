import {
  ingredientTypeFishMap,
  ingredientTypeMeatMap,
  ingredientTypeVeganMap,
  ingredientTypeVegeMap
} from '../consts/ingredient-type-diet.const';
import { IngredientTypeIconEnum, IngredientTypeKeyEnum, IngredientTypeLabelEnum } from '../enums';
import { dateMock } from '../mocks/date.mock';
import { EnumHelper } from '../tools';
import { IngredientModel } from './ingredient.model';
import { KitchenIngredientModel } from './kitchen-ingredient.model';

describe('IngredientModel', () => {
  describe('IngredientModel.constructor', () => {
    it('should construct', () => {
      expect(new KitchenIngredientModel({})).toBeDefined();
    });

    it('should contain isLiquid boolean value', () => {
      expect(new IngredientModel({isLiquid: true})).toMatchObject({isLiquid: true});
    });

    it('should contain isLiquid null value', () => {
      expect(new IngredientModel({})).toMatchObject({isLiquid: null});
    });
  });

  describe('IngredientModel.typeName', () => {
    it('should return type name', () => {
      expect(new IngredientModel({type: IngredientTypeKeyEnum.meats}).typeName).toBe(IngredientTypeLabelEnum.meats);
    });
  });

  describe('IngredientModel.typeIcon', () => {
    it('should return icons', () => {
      const icons = EnumHelper.enumToMap(IngredientTypeIconEnum);
      const keys = Object.keys(IngredientTypeKeyEnum);

      for (const key of keys) {
        expect(new IngredientModel({type: key}).typeIcon).toBe(icons.get(key));
      }

      expect.assertions(keys.length);
    });
  });

  describe('IngredientModel.format', () => {
    it('should format ingredient date', () => {
      expect(IngredientModel.format({
        dateBegin: dateMock,
        dateEnd: dateMock,
      }))
        .toEqual(new IngredientModel({
          monthBegin: 8,
          monthEnd: 8,
        }));
    });
  });

  describe('IngredientModel.nameContain', () => {
    it('should return true if name contain searched word', () => {
      expect(new IngredientModel({name: 'ceci est un test', slug: 'rien'})
        .nameContain('test')).toBe(true);
    });

    it('should return true if slug contain searched word', () => {
      expect(new IngredientModel({name: 'rien', slug: 'ceci est un test'})
        .nameContain('test')).toBe(true);
    });

    it('should return true if name and slug slug contain searched word', () => {
      expect(new IngredientModel({name: 'test test', slug: 'ceci est un test'})
        .nameContain('test')).toBe(true);
    });

    it('should return false if name and slug don\'t contain searched word', () => {
      expect(new IngredientModel({name: 'rien', slug: 'nothing'})
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
      };
      const objectToHydrated = new IngredientModel({name: 'test', id});

      objectToHydrated.hydrate(hydratedValues);

      expect(objectToHydrated).toEqual({...hydratedValues, id});
    });
  });

  describe('IngredientModel.isMeat', () => {
    it.each(Array.from(ingredientTypeMeatMap))
    ('should %s return %p', (key, value) => {
      expect(new IngredientModel({type: key}).isMeat()).toBe(value);
    });
  });

  describe('IngredientModel.isFish', () => {
    it.each(Array.from(ingredientTypeFishMap))
    ('should %s return %p', (key, value) => {
      expect(new IngredientModel({type: key}).isFish()).toBe(value);
    });
  });

  describe('IngredientModel.isVege', () => {
    it.each(Array.from(ingredientTypeVegeMap))
    ('should %s return %p', (key, value) => {
      expect(new IngredientModel({type: key}).isVege()).toBe(value);
    });
  });

  describe('IngredientModel.isVegan', () => {
    it.each(Array.from(ingredientTypeVeganMap))
    ('should %s return %p', (key, value) => {
      expect(new IngredientModel({type: key}).isVegan()).toBe(value);
    });
  });

  describe('IngredientModel.isSweet', () => {
    it.each(IngredientModel.sweetNames)
    ('should %s return true', (name) => {
      expect(new IngredientModel({name}).isSweet()).toBe(true);
    });

    it.each(IngredientModel.saltyNames)
    ('should %s return true', (name) => {
      expect(new IngredientModel({name}).isSweet()).toBe(false);
    });
  });
  describe('IngredientModel.isSalty', () => {
    it.each([
      IngredientTypeKeyEnum.fishes_seafoods,
      IngredientTypeKeyEnum.meats
    ])
    ('should %s return false', (type) => {
      expect(new IngredientModel({type}).isSalty()).toBe(true);
    });

    it.each(IngredientModel.saltyNames)
    ('should %s return false', (name) => {
      expect(new IngredientModel({name}).isSalty()).toBe(true);
    });

    it.each(IngredientModel.sweetNames)
    ('should %s return true', (name) => {
      expect(new IngredientModel({name}).isSweet()).toBe(false);
    });

    it.each([ '' ])
    ('should %s return false', (name) => {
      expect(new IngredientModel({name}).isSalty()).toBe(false);
    });
  });

  describe('IngredientModel.isSeason', () => {
    jest
      .useFakeTimers()
      .setSystemTime(dateMock);

    const testsSeason = [
      [ 8, 8 ],
      [ 8, 9 ],
      [ 7, 8 ],
      [ 6, 9 ],
      [ 8, 1 ],
      [ 9, 8 ],
      [ 7, 1 ],
    ];
    const testsNotSeason = [
      [ 9, 7 ],
      [ 9, 12 ],
      [ 1, 7 ],
    ];

    it.each(testsSeason)
    ('should months %i to %i return true', (monthBegin, monthEnd) => {
      expect(new IngredientModel({
        type: IngredientTypeKeyEnum.fruits_vegetables_mushrooms,
        monthBegin,
        monthEnd,
      }).isSeason()).toBe(true);
    });

    it.each(testsNotSeason)
    ('should months %i to %i return false', (monthBegin, monthEnd) => {
      expect(new IngredientModel({
        type: IngredientTypeKeyEnum.fruits_vegetables_mushrooms,
        monthBegin,
        monthEnd,
      }).isSeason()).toBe(false);
    });

    it('should return true if ingredient has not season', () => {
      expect(new IngredientModel({}).isSeason()).toBe(true);
      expect(new IngredientModel({
        monthBegin: 1,
        monthEnd: 12, type: IngredientTypeKeyEnum.alcohols
      }).isSeason()).toBe(true);
    });
  });
});

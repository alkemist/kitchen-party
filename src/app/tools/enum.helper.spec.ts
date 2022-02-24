import { EnumHelper } from './enum.helper';

describe('EnumHelper', () => {
  enum enumValue {
    firstValue = 'First value',
    secondValue = 'Second value'
  }

  it('enumToAssociativArray', () => {
    const associativArray = {'firstValue': 'First value', 'secondValue': 'Second value'};
    const associativArrayReturned = EnumHelper.enumToAssociativArray(enumValue);
    expect(associativArrayReturned).toEqual(associativArray);
  });
  it('enumToObject', () => {
    const object = [ {key: 'firstValue', label: 'First value'}, {key: 'secondValue', label: 'Second value'} ];
    const objectReturned = EnumHelper.enumToObject(enumValue);
    expect(objectReturned).toEqual(object);
  });
  it('enumToRegex', () => {
    const regex = /firstValue|secondValue/;
    const regexReturned = EnumHelper.enumToRegex(enumValue);
    expect(regexReturned).toEqual(regex);
  });
});
import { ArrayHelper } from './array.helper';

describe('ArrayHelper', () => {
  it('sortBy', () => {
    const arrayNotSorted = [ {name: 'b'}, {name: 'c'}, {name: 'a'}, {name: 'c'} ];
    const arraySorted = [ {name: 'a'}, {name: 'b'}, {name: 'c'}, {name: 'c'} ];
    const arrayReturned = ArrayHelper.sortBy(arrayNotSorted, 'name');
    expect(arrayReturned).toEqual(arraySorted);
  });
});
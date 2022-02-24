import { slugify } from './slugify';

describe('slugify', () => {
  it('slugify', () => {
    expect(slugify('Azért(#@%i " qWérti°')).toEqual('azerti-qwerti');
  });
});
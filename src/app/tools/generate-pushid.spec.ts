import { generatePushID } from './generate-pushid';

describe('generate-pushid', () => {
  it('generate-pushid', () => {
    const date = new Date('1984-08-04 12:12');
    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    expect(generatePushID(date)).toEqual('-5gpgLa-aaaaaaaaaaaa');
    expect(generatePushID()).toBeDefined();
  });
});
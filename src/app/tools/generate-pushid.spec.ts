import { generatePushID } from './generate-pushid';
import { dateMock } from '../mocks/date.mock';

describe('generate-pushid', () => {
  it('generate-pushid', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    expect(generatePushID(dateMock)).toEqual('-5gpgLa-aaaaaaaaaaaa');
    expect(generatePushID()).toBeDefined();
  });
});

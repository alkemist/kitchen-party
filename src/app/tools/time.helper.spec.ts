import { TimeHelper } from './time.helper';
import { dateMock } from '../mocks/date.mock';

describe('TimeHelper', () => {
  it('calcHoursAfter', () => {
    const dateNow = new Date('2022-02-22 22:22');
    jest.spyOn(dateMock, 'getTime').mockReturnValue(460462320000);
    jest.spyOn(dateNow, 'getTime').mockReturnValue(1645564920000);
    const hours = TimeHelper.calcHoursAfter(dateMock, dateNow);
    expect(hours).toEqual(329195);
  });
});

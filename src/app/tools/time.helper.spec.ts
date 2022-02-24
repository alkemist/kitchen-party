import { TimeHelper } from './time.helper';

describe('TimeHelper', () => {
  it('calcHoursAfter', () => {
    const date = new Date('1984-08-04 12:12');
    const dateNow = new Date('2022-02-22 22:22');
    const hours = TimeHelper.calcHoursAfter(date, dateNow);
    expect(hours).toEqual(329195);
  });
});
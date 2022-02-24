import { DateHelper } from './date.helper';

describe('DateHelper', () => {
  const date = new Date('1984-08-04 12:12');

  it('clearTime', () => {
    const dateTimeCleared = new Date('1984-08-04 00:00');
    const dateReturned = DateHelper.clearTime(date);
    expect(dateReturned).toEqual(dateTimeCleared);
  });
  it('monthBegin', () => {
    const dateMonthBegin = new Date('1984-08-01 00:00');
    const dateReturned = DateHelper.monthBegin(date);
    expect(dateReturned).toEqual(dateMonthBegin);
  });
  it('monthEnd', () => {
    const dateMonthEnd = new Date('1984-08-31 23:59:59.059');
    const dateReturned = DateHelper.monthEnd(date);
    expect(dateReturned).toEqual(dateMonthEnd);
  });
});
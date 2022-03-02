import { DateHelper } from './date.helper';
import { dateMock } from '../mocks/date.mock';

describe('DateHelper', () => {

  it('clearTime', () => {
    const dateTimeCleared = new Date('1984-08-04 00:00');
    const dateReturned = DateHelper.clearTime(dateMock);
    expect(dateReturned).toEqual(dateTimeCleared);
  });
  it('monthBegin', () => {
    const dateMonthBegin = new Date('1984-08-01 00:00');
    const dateReturned = DateHelper.monthBegin(dateMock);
    expect(dateReturned).toEqual(dateMonthBegin);
  });
  it('monthEnd', () => {
    const dateMonthEnd = new Date('1984-08-31 23:59:59.059');
    const dateReturned = DateHelper.monthEnd(dateMock);
    expect(dateReturned).toEqual(dateMonthEnd);
  });
});

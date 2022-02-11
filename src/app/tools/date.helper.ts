export abstract class DateHelper {
  static clearTime(date: Date): Date {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  static monthBegin(date: Date): Date {
    const firstDayOnMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return DateHelper.clearTime(firstDayOnMonth);
  }

  static monthEnd(date: Date): Date {
    const lastDayOnMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    lastDayOnMonth.setHours(23);
    lastDayOnMonth.setMinutes(59);
    lastDayOnMonth.setSeconds(59);
    lastDayOnMonth.setMilliseconds(59);
    return lastDayOnMonth;
  }
}
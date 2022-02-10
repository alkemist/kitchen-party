export abstract class DateHelper {
  static clearTime(date: Date): Date {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  static clearDayAndTime(date: Date): Date {
    const firstDayOnMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return DateHelper.clearTime(firstDayOnMonth);
  }
}
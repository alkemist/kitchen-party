export abstract class TimeHelper {
  static calcHoursAfter(date: string | Date, dateNow?: Date): number {
    const dateTime = (dateNow ? dateNow : new Date()).getTime();
    const lastUpdatedTime = new Date(date).getTime();
    return Math.round((dateTime - lastUpdatedTime) / (1000 * 60 * 60));
  }
}
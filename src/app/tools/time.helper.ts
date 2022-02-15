export abstract class TimeHelper {
  static calcHoursAfter(date: string | Date) {
    const dateTime = new Date().getTime();
    const lastUpdatedTime = new Date(date).getTime();
    return (dateTime - lastUpdatedTime) / (1000 * 60 * 60);
  }
}
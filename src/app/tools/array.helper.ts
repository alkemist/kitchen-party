import {slugify} from "./slugify";

export abstract class ArrayHelper {
  static sortBy<T>(array: T[], field: string): T[] {
    return array.sort((a: any, b: any) => {
      const aValue = slugify(a[field]!);
      const bValue = slugify(b[field]!);
      return (aValue > bValue) ? 1 : ((bValue > aValue) ? -1 : 0);
    });
  }
}
import {slugify} from "./slugify";
import {DataObject} from "../services/firestore.service";

export abstract class ArrayHelper {
  static sortByName<T extends DataObject>(array: T[]): T[] {
    return array.sort((a, b) => {
      const aName = slugify(a.name!);
      const bName = slugify(b.name!);
      return (aName > bName) ? 1 : ((bName > aName) ? -1 : 0);
    });
  }

  static sortBySlug<T extends DataObject>(array: T[]): T[] {
    return array.sort((a, b) => {
      const aSlug = a.slug!;
      const bSlug = b.slug!;
      return (aSlug > bSlug) ? 1 : ((bSlug > aSlug) ? -1 : 0);
    });
  }
}
import { KeyLabelInterface } from '../interfaces';
import { ArrayHelper } from './array.helper';

export abstract class EnumHelper {
  static enumToAssociativArray(enumValue: any): { [key: string]: string } {
    const keys = Object.keys(enumValue);
    const values = Object.values(enumValue);
    return keys.reduce((obj, key, index) => ({...obj, [key]: values[index]}), {});
  }

  static enumToObject(enumValue: any): KeyLabelInterface[] {
    const keys = Object.keys(enumValue);
    const values = Object.values(enumValue) as string[];
    const objects = keys.map((value, index) => {
      return {key: value, label: values[index]};
    });
    return ArrayHelper.sortBy<KeyLabelInterface>(objects, 'label');
  }

  static enumToMap<T extends string, U extends string>(enumValue: any): Map<T, U> {
    const keys = Array.from(Object.keys(enumValue)) as T[];
    const values = Object.values(enumValue) as U[];
    return ArrayHelper.keysValuesToMap<T, U>(keys, values);
  }

  static enumToRegex(enumValue: any): RegExp {
    const keys = Object.keys(enumValue);
    return new RegExp(keys.join('|'));
  }
}

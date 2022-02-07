import {KeyObject} from '../models/other.model';

export abstract class EnumHelper {
  static enumToAssociativArray(enumValue: any): { [key: string]: string } {
    const keys = Object.keys(enumValue);
    const values = Object.values(enumValue);
    return keys.reduce((obj, key, index) => ({...obj, [key]: values[index]}), {});
  }

  static enumToObject(enumValue: any): KeyObject[] {
    const keys = Object.keys(enumValue);
    const values = Object.values(enumValue) as string[];
    return keys.map((value, index) => {
      return {key: value, label: values[index]};
    });
  }

  static enumToRegex(enumValue: any): RegExp {
    const keys = Object.keys(enumValue);
    return new RegExp(keys.join('|'));
  }
}

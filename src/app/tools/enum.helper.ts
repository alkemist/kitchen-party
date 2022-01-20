export abstract class EnumHelper {
  enumToAssociativArray(enumValue: any) {
    const keys = Object.keys(enumValue);
    const values = Object.values(enumValue);
    return keys.reduce((obj, key, index) => ({...obj, [key]: values[index]}), {});
  }

  enumToObject(enumValue: any) {
    const keys = Object.keys(enumValue);
    const values = Object.values(enumValue);
    return keys.map((value, index) => {
      return {key: value, label: values[index]};
    });
  }
}

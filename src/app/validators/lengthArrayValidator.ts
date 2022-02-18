import { AbstractControl, ValidatorFn } from '@angular/forms';

export function lengthArrayValidator(length: number): ValidatorFn {
  return (c: AbstractControl): { [p: string]: any } | null => {
    if (!c.value) {
      return null;
    }

    if (c.value.length === length) {
      for (const value of c.value as Date[]) {
        if (!value) {
          return {'lengthArray': {valid: false}};
        }
      }
      return null;
    }

    return {'lengthArray': {valid: false}};
  };
}

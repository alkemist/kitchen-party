import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {CartIngredientFormInterface} from '@interfaces';

export function cartIngredientValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cartIngredient: CartIngredientFormInterface = control.value;
    const isValid = cartIngredient.ingredient && !cartIngredient.other
      || cartIngredient.other && !cartIngredient.ingredient;
    return isValid ? null : {invalid: {value: control.value}};
  };
}

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RecipeIngredientFormInterface } from '@interfaces';

export function recipeIngredientValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const recipeIngredientForm: RecipeIngredientFormInterface = control.value;
    const isValid = !recipeIngredientForm.unitOrMeasure
      || recipeIngredientForm.quantity && recipeIngredientForm.unitOrMeasure;
    return isValid ? null : {invalid: {value: control.value}};
  };
}

import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {FirestoreService} from '../services/firestore.service';


export function dontExistValidator<T>(service: FirestoreService<T>): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors> => {
    return new Promise<ValidationErrors>((resolve) => {
      service.exist(control.value).then((exist) => {
          resolve(exist ? {exist: true} : {});
        }
      );
    });
  };
}

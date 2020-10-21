import {FormControl} from '@angular/forms';

/**
 * Permet de vérifier qu'on a selectionner un item dans un autocomplete
 * Sinon c'est la valeur du champs de recherche qui est renvoyé
 * @param control
 */
export const isUnselectedAutocompleteValidator = (control: FormControl) => {
  return control.value && typeof control.value === 'string' ? {unselected: true} : null;
};

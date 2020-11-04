import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {IngredientInterface} from '../../interfaces/ingredient';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {IngredientStoreService} from '../../services/ingredient-store.service';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericFormComponent} from '../../generics/generic-form.component';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.scss']
})
export class IngredientFormComponent extends GenericFormComponent<IngredientInterface> implements OnInit {
  entityName = 'ingredient';
  entity: IngredientInterface;

  constructor(
    protected route: ActivatedRoute,
    protected ingredientStore: IngredientStoreService,
    protected familyStore: FamilyStoreService,
    protected formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    super(ingredientStore, route, formBuilder, snackBar);
  }

  ngOnInit(): void {
    this.onInit();
  }

  edit(): void {
    const ingredient: IngredientInterface = this.form.value;

    if (this.form.valid) {
      if (ingredient.family && typeof ingredient.family === 'string') {
        this.familyStore.create({name: ingredient.family}).then(family => {
          ingredient.family = family;
          ingredient.familyId = family.id;
          this.send(ingredient);
        });
      } else {
        this.send(ingredient);
      }
    }
  }
}

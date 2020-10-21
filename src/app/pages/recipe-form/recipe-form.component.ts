import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {RecipeInterface} from '../../interfaces/recipe';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {RecipeStoreService} from '../../services/recipe-store.service';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericFormComponent} from '../../generics/generic-form.component';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent extends GenericFormComponent<RecipeInterface> implements OnInit {
  entityName = 'recipe';
  entity: RecipeInterface;

  constructor(
    protected route: ActivatedRoute,
    protected recipeStore: RecipeStoreService,
    protected familyStore: FamilyStoreService,
    protected formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    super(recipeStore, route, formBuilder, snackBar)
  }

  ngOnInit(): void {
    this.onInit();
  }
}

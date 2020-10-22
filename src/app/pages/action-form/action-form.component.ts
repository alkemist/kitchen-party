import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ActionInterface} from '../../interfaces/action';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {ActionStoreService} from '../../services/action-store.service';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericFormComponent} from '../../generics/generic-form.component';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html',
  styleUrls: ['./action-form.component.scss']
})
export class ActionFormComponent extends GenericFormComponent<ActionInterface> implements OnInit {
  entityName = 'action';
  entity: ActionInterface;

  constructor(
    protected route: ActivatedRoute,
    protected actionStore: ActionStoreService,
    protected formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    super(actionStore, route, formBuilder, snackBar);
  }

  ngOnInit(): void {
    this.onInit();
  }
}

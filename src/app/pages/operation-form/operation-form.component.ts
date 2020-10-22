import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {OperationInterface} from '../../interfaces/operation';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {OperationStoreService} from '../../services/operation-store.service';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericFormComponent} from '../../generics/generic-form.component';

@Component({
  selector: 'app-operation-form',
  templateUrl: './operation-form.component.html',
  styleUrls: ['./operation-form.component.scss']
})
export class OperationFormComponent extends GenericFormComponent<OperationInterface> implements OnInit {
  entityName = 'operation';
  entity: OperationInterface;

  constructor(
    protected route: ActivatedRoute,
    protected operationStore: OperationStoreService,
    protected familyStore: FamilyStoreService,
    protected formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    super(operationStore, route, formBuilder, snackBar);
  }

  ngOnInit(): void {
    this.onInit();
  }

  edit(): void {
    const operation = this.form.value;

    if (this.form.valid) {
      this.send(operation);
    }
  }
}

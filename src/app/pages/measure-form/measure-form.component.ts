import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MeasureInterface} from '../../interfaces/measure';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {MeasureStoreService} from '../../services/measure-store.service';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericFormComponent} from '../../generics/generic-form.component';

@Component({
  selector: 'app-measure-form',
  templateUrl: './measure-form.component.html',
  styleUrls: ['./measure-form.component.scss']
})
export class MeasureFormComponent extends GenericFormComponent<MeasureInterface> implements OnInit {
  entityName = 'measure';
  entity: MeasureInterface;

  constructor(
    protected route: ActivatedRoute,
    protected measureStore: MeasureStoreService,
    protected familyStore: FamilyStoreService,
    protected formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    super(measureStore, route, formBuilder, snackBar)
  }

  ngOnInit(): void {
    this.onInit();
  }
}

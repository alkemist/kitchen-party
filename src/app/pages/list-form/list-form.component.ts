import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ListInterface} from '../../interfaces/list';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {ListStoreService} from '../../services/list-store.service';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericFormComponent} from '../../generics/generic-form.component';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['./list-form.component.scss']
})
export class ListFormComponent extends GenericFormComponent<ListInterface> implements OnInit {
  entityName = 'list';
  entity: ListInterface;

  constructor(
    protected route: ActivatedRoute,
    protected listStore: ListStoreService,
    protected formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    super(listStore, route, formBuilder, snackBar);
  }

  ngOnInit(): void {
    this.onInit();
  }
}

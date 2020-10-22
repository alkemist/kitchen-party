import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ShelfInterface} from '../../interfaces/shelf';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {ShelfStoreService} from '../../services/shelf-store.service';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericFormComponent} from '../../generics/generic-form.component';

@Component({
  selector: 'app-shelf-form',
  templateUrl: './shelf-form.component.html',
  styleUrls: ['./shelf-form.component.scss']
})
export class ShelfFormComponent extends GenericFormComponent<ShelfInterface> implements OnInit {
  entityName = 'shelf';
  entity: ShelfInterface;

  constructor(
    protected route: ActivatedRoute,
    protected shelfStore: ShelfStoreService,
    protected formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    super(shelfStore, route, formBuilder, snackBar);
  }

  ngOnInit(): void {
    this.onInit();
  }
}

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ProductInterface} from '../../interfaces/product';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {ProductStoreService} from '../../services/product-store.service';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericFormComponent} from '../../generics/generic-form.component';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent extends GenericFormComponent<ProductInterface> implements OnInit {
  entityName = 'product';
  entity: ProductInterface;

  constructor(
    protected route: ActivatedRoute,
    protected productStore: ProductStoreService,
    protected formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    super(productStore, route, formBuilder, snackBar);
  }

  ngOnInit(): void {
    this.onInit();
  }
}

import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FamilyInterface} from '../../interfaces/family';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericFormComponent} from '../../generics/generic-form.component';

@Component({
  selector: 'app-family-form',
  templateUrl: './family-form.component.html',
  styleUrls: ['./family-form.component.scss']
})
export class FamilyFormComponent extends GenericFormComponent<FamilyInterface> implements OnInit {
  entityName = 'family';
  entity: FamilyInterface;

  constructor(
    protected route: ActivatedRoute,
    protected familyStore: FamilyStoreService,
    protected formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    super(familyStore, route, formBuilder, snackBar);
  }

  ngOnInit(): void {
    this.onInit();
  }

  edit(): void {
    const family = this.form.value;

    if (this.form.valid) {
      if (family.family && typeof family.family === 'string') {
        this.familyStore.create({name: family.family}).then(parent => {
          family.family = parent;
          family.familyId = parent.id;
          this.send(family);
        });
      } else {
        this.send(family);
      }
    }
  }
}

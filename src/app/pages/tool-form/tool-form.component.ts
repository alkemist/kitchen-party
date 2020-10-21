import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ToolInterface} from '../../interfaces/tool';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {ToolStoreService} from '../../services/tool-store.service';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericFormComponent} from '../../generics/generic-form.component';

@Component({
  selector: 'app-tool-form',
  templateUrl: './tool-form.component.html',
  styleUrls: ['./tool-form.component.scss']
})
export class ToolFormComponent extends GenericFormComponent<ToolInterface> implements OnInit {
  entityName = 'tool';
  entity: ToolInterface;

  constructor(
    protected route: ActivatedRoute,
    protected toolStore: ToolStoreService,
    protected familyStore: FamilyStoreService,
    protected formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    super(toolStore, route, formBuilder, snackBar)
  }

  ngOnInit(): void {
    this.onInit();
  }
}

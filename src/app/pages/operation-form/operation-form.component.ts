import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren} from '@angular/core';
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
import {MeasureIngredientStoreService} from '../../services/measure-ingredient-store.service';
import {MeasureToolStoreService} from '../../services/measure-tool-store.service';
import {MeasureOperationStoreService} from '../../services/measure-operation-store.service';
import {SortableInterface} from '../../interfaces/sortable';
import {OperationComponent} from '../../components/operation/operation.component';

@Component({
  selector: 'app-operation-form',
  templateUrl: './operation-form.component.html',
  styleUrls: ['./operation-form.component.scss']
})
export class OperationFormComponent extends GenericFormComponent<OperationInterface> implements OnInit {
  entityName = 'operation';
  entity: OperationInterface;

  @ViewChild('component') component: OperationComponent;

  static saveOperation(
    operation: OperationInterface,
    measureIngredientStore: MeasureIngredientStoreService,
    measureToolStore: MeasureToolStoreService,
    measureOperationStore: MeasureOperationStoreService,
  ): Promise<OperationInterface>[] {
    const sortFormArray = (a: SortableInterface, b: SortableInterface): number => {
      const aValue = a.order;
      const bValue = b.order;
      return aValue > bValue ? 1 : aValue === bValue ? 0 : -1;
    };

    const promises: Promise<OperationInterface>[] = [];

    const measureIngredients = Object.assign([], operation.measureIngredients);
    operation.measureIngredients = [];
    measureIngredients.sort(sortFormArray).forEach(mesureIngredient => {
      if (!mesureIngredient.id) {
        promises.push(new Promise<OperationInterface>(resolveMeasureIngredient => {
          measureIngredientStore.create(mesureIngredient).then(mesureIngredientSaved => {
            operation.measureIngredients.push(mesureIngredientSaved);
            resolveMeasureIngredient(operation);
          });
        }));
      } else {
        promises.push(new Promise<OperationInterface>(resolveMeasureIngredient => {
          measureIngredientStore.update(mesureIngredient).then(mesureIngredientSaved => {
            operation.measureIngredients.push(mesureIngredientSaved);
            resolveMeasureIngredient(operation);
          });
        }));
      }
    });

    const measureTools = Object.assign([], operation.measureTools);
    operation.measureTools = [];
    measureTools.sort(sortFormArray).forEach(mesureTool => {
      if (!mesureTool.id) {
        promises.push(new Promise<OperationInterface>(resolveMeasureTool => {
          measureToolStore.create(mesureTool).then(mesureToolSaved => {
            operation.measureTools.push(mesureToolSaved);
            resolveMeasureTool(operation);
          });
        }));
      } else {
        promises.push(new Promise<OperationInterface>(resolveMeasureTool => {
          measureToolStore.update(mesureTool).then(mesureToolSaved => {
            operation.measureTools.push(mesureToolSaved);
            resolveMeasureTool(operation);
          });
        }));
      }
    });

    const measureOperations = Object.assign([], operation.measureOperations);
    operation.measureOperations = [];
    measureOperations.sort(sortFormArray).forEach(mesureOperation => {
      if (!mesureOperation.id) {
        promises.push(new Promise<OperationInterface>(resolveMeasureOperation => {
          measureOperationStore.create(mesureOperation).then(mesureOperationSaved => {
            operation.measureOperations.push(mesureOperationSaved);
            resolveMeasureOperation(operation);
          });
        }));
      } else {
        promises.push(new Promise<OperationInterface>(resolveMeasureOperation => {
          measureOperationStore.update(mesureOperation).then(mesureOperationSaved => {
            operation.measureOperations.push(mesureOperationSaved);
            resolveMeasureOperation(operation);
          });
        }));
      }
    });

    return promises;
  }

  constructor(
    protected route: ActivatedRoute,
    protected operationStore: OperationStoreService,
    protected measureIngredientStore: MeasureIngredientStoreService,
    protected measureToolStore: MeasureToolStoreService,
    protected measureOperationStore: MeasureOperationStoreService,
    protected familyStore: FamilyStoreService,
    protected formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    super(operationStore, route, formBuilder, snackBar);
  }

  ngOnInit(): void {
    this.onInit();
  }

  initForm(entity): void {
    this.entity = entity;
    this.form.patchValue(entity);
    this.component.initForm(entity);
  }

  edit(): void {
    const operation: OperationInterface = this.form.value;

    if (this.form.valid) {
      const promises = OperationFormComponent.saveOperation(operation,
        this.measureIngredientStore,
        this.measureToolStore,
        this.measureOperationStore
      );

      if (promises.length > 0) {
        Promise.all(promises).then(operations => {
          const operationHydrated = Object.assign({}, ...operations);
          this.send(operationHydrated);
        });
      } else {
        this.send(operation);
      }

    }
  }
}

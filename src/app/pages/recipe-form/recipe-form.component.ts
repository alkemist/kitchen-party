import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RecipeInterface} from '../../interfaces/recipe';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {RecipeStoreService} from '../../services/recipe-store.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericFormComponent} from '../../generics/generic-form.component';
import {OperationStoreService} from '../../services/operation-store.service';
import {ActionStoreService} from '../../services/action-store.service';
import {OperationInterface} from '../../interfaces/operation';
import {OperationFormComponent} from '../operation-form/operation-form.component';
import {MeasureIngredientStoreService} from '../../services/measure-ingredient-store.service';
import {MeasureToolStoreService} from '../../services/measure-tool-store.service';
import {MeasureOperationStoreService} from '../../services/measure-operation-store.service';
import {OperationComponent} from '../../components/operation/operation.component';
import {RecipeComponent} from '../../components/recipe/recipe.component';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent extends GenericFormComponent<RecipeInterface> implements OnInit {
  entityName = 'recipe';
  entity: RecipeInterface;

  @ViewChild('component') component: RecipeComponent;

  constructor(
    protected route: ActivatedRoute,
    protected recipeStore: RecipeStoreService,
    protected operationStore: OperationStoreService,
    protected actionStoreService: ActionStoreService,
    protected measureIngredientStore: MeasureIngredientStoreService,
    protected measureToolStore: MeasureToolStoreService,
    protected measureOperationStore: MeasureOperationStoreService,
    protected formBuilder: FormBuilder,
    public snackBar: MatSnackBar
  ) {
    super(recipeStore, route, formBuilder, snackBar);
  }

  ngOnInit(): void {
    this.onInit();
  }

  initForm(entity): void {
    this.entity = entity;
    this.form.patchValue(entity);
    this.component.initForm(entity);
  }

  onSaveOperation(output: {index: number, operation: OperationInterface}): Promise<OperationInterface> {
    const promises = OperationFormComponent.saveOperation(output.operation,
      this.measureIngredientStore,
      this.measureToolStore,
      this.measureOperationStore
    );

    if (promises.length > 0) {
      Promise.all(promises).then(operations => {
        const operationHydrated = Object.assign({}, ...operations);

        return this.saveOperation(output.index, output.operation.id, operationHydrated);
      });
    } else {
      return this.saveOperation(output.index, output.operation.id, output.operation);
    }
  }

  private saveOperation(index: number, id: number, operationHydrated: OperationInterface): Promise<OperationInterface> {
    return new Promise<OperationInterface>(operationResolve => {
      const promiseOperation = id
        ? this.operationStore.update(operationHydrated)
        : this.operationStore.create(operationHydrated);

      promiseOperation.then(operationCreated => {
        if (id) {
          this.snackBar.open('Opération mis à jour', 'Fermer', {duration: 5000});
        } else {
          this.snackBar.open('Opération créé', 'Fermer', {duration: 5000});
        }
        (this.form.get('operations') as FormArray).at(index).get('operation').get('id').patchValue(operationCreated.id);
        operationResolve(operationCreated);
      });
    });
  }

  edit(): void {
    const operations = this.form.value.operations as {index: number, operation: OperationInterface}[];

    if (this.form.valid) {
      const promises: Promise<OperationInterface>[] = [];

      operations.forEach((formData, index) => {
        if (typeof formData.operation.action === 'string') {
          promises.push(new Promise<OperationInterface>(resolve => {
            this.actionStoreService.create({name: formData.operation.action.toString()}).then(actionCreated => {
              formData.operation.action = actionCreated;

              this.onSaveOperation({index, operation: formData.operation}).then((operationCreated) => {
                resolve(operationCreated);
              });
            });
          }));
        } else {
          promises.push(this.onSaveOperation({index, operation: formData.operation}));
        }
      });

      Promise.all(promises).then(operationsCreated => {
        const recipe = { ...this.form.value };

        recipe.operations = (this.form.value.operations as {index: number, operation: OperationInterface}[])
          .map(formData => formData.operation);

        this.send(recipe);
      });
    }
  }
}

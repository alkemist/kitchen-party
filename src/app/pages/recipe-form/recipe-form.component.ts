import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.scss']
})
export class RecipeFormComponent extends GenericFormComponent<RecipeInterface> implements OnInit {
  entityName = 'recipe';
  entity: RecipeInterface;

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

  saveOperation(output: {index: number, operation: OperationInterface}): Promise<OperationInterface> {
    console.error('save operation', output);

    return new Promise<OperationInterface>(operationResolve => {
      const promises = OperationFormComponent.saveOperation(output.operation,
        this.measureIngredientStore,
        this.measureToolStore,
        this.measureOperationStore
      );

      if (promises.length > 0) {
        Promise.all(promises).then(operations => {
          const operationHydrated = Object.assign({}, ...operations);

          console.error('operationHydrated', operationHydrated);

          const promiseOperation = output.operation.id
            ? this.operationStore.create(operationHydrated)
            : this.operationStore.update(operationHydrated);

          promiseOperation.then(operationCreated => {
            if (output.operation.id) {
              this.snackBar.open('Opération créé', 'Fermer', {duration: 5000});
            } else {
              this.snackBar.open('Opération mis à jour', 'Fermer', {duration: 5000});
            }
            // TODO : On patch uniquement l'id
            //(this.form.get('operations') as FormArray).at(output.index).get('operation').patchValue(operationCreated);
            operationResolve(operationCreated);
          });
        });
      } else {
        // TODO : On crée uniquement l'opération
      }
    });
  }

  edit(): void {
    const recipe: RecipeInterface = this.form.value;

    console.error('edit', recipe, this.form.valid);

    if (this.form.valid) {
      const promises: Promise<OperationInterface>[] = [];

      recipe.operations.forEach((operation, index) => {

        if (typeof operation.action === 'string') {
          promises.push(new Promise<OperationInterface>(resolve => {
            this.actionStoreService.create({name: operation.action.toString()}).then(actionCreated => {
              operation.action = actionCreated;
              operation.actionId = actionCreated.id;

              this.saveOperation({index, operation}).then((operationCreated) => {
                resolve(operationCreated);
              });
            });
          }));
        } else {
          promises.push(this.saveOperation({index, operation}));
        }
      });

      Promise.all(promises).then(operations => {
        console.error('operations', operations);
        this.send(recipe);
      });
    }
  }
}

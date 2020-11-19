import {Component, Input, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {RecipeInterface} from '../../interfaces/recipe';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FamilyInterface} from '../../interfaces/family';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatterEnum} from '../../enums/matter';
import {IngredientStoreService} from '../../services/ingredient-store.service';
import {ToolStoreService} from '../../services/tool-store.service';
import {RecipeStoreService} from '../../services/recipe-store.service';
import {MeasureStoreService} from '../../services/measure-store.service';
import {OperationStoreService} from '../../services/operation-store.service';
import {OperationInterface} from '../../interfaces/operation';
import {OperationComponent} from '../operation/operation.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
  @Input() recipe: RecipeInterface;
  @Output() readonly formOutput = new EventEmitter<FormGroup>();
  @Output() readonly operationOutput = new EventEmitter<{index: number, operation: OperationInterface}>();

  form: FormGroup = new FormGroup({});
  operationObjects = [];

  @ViewChild('component') component: OperationComponent;

  get operations(): FormArray {
    return (this.form.get('operations') as FormArray);
  }
  get operationsControls(): AbstractControl[] {
    return (this.form.get('operations') as FormArray).controls.sort((a, b) => {
      const aValue = a.get('order').value;
      const bValue = b.get('order').value;
      return aValue > bValue ? 1 : aValue === bValue ? 0 : -1;
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private operationStore: OperationStoreService
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: this.formBuilder.control('', []),
      name: this.formBuilder.control('', [Validators.required]),
      // duration: this.formBuilder.control('', [Validators.required]),
      // peoples: this.formBuilder.control('', [Validators.required]),
      type: this.formBuilder.control('', []),
      complexity: this.formBuilder.control('', []),
      price: this.formBuilder.control('', []),
      operations: this.formBuilder.array([])
    });
    this.formOutput.emit(this.form);
  }

  initForm(recipe: RecipeInterface): void {
    this.operationObjects = recipe.operations;

    recipe.operations.forEach(operation => {
      this.addOperation(operation);
    });
  }

  saveOperation(i: number): void {
    if (this.operations.at(i).valid) {
      this.operationOutput.emit({index: i, operation: this.operations.at(i).get('operation').value});
    }
  }

  addOperation(operation: OperationInterface = null): void {
    const operationForm: FormGroup = this.formBuilder.group({
      order: this.formBuilder.control(this.operations.length + 1, []),
      operation: this.formBuilder.group({})
    });
    operationForm.get('operation').patchValue(operation);

    this.operations.push(operationForm);
  }

  changeOrderOperation(i: number, value: number): void {
    const currentOrderValue = this.operationsControls[i].get('order').value;
    const newOrderValue = currentOrderValue + value;
    this.operationsControls[newOrderValue - 1].get('order').patchValue(currentOrderValue);
    this.operationsControls[currentOrderValue - 1].get('order').patchValue(newOrderValue);
  }

  deleteOperation(i: number): void {
    this.operations.removeAt(i);
    this.operations.controls.forEach((operation: FormGroup, index) => {
      operation.get('order').patchValue(index + 1);
    });
    this.operationObjects.splice(i, 1);
  }

  formOperationUpdate(index: number, form: FormGroup): void{
    (this.operations.at(index) as FormGroup).setControl('operation', form);

    if (typeof this.operationObjects[index] !== 'undefined') {
      this.operations.at(index).get('operation').patchValue(this.operationObjects[index]);
    } else {
      this.operationObjects.push(null);
    }
  }
}

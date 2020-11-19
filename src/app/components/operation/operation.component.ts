import {Component, Input, OnInit, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {
  MeasureIngredientInterface, MeasureOperationInterface, MeasureToolInterface,
  OperationInterface,
} from '../../interfaces/operation';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FamilyInterface} from '../../interfaces/family';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatterEnum} from '../../enums/matter';
import {IngredientStoreService} from '../../services/ingredient-store.service';
import {ToolStoreService} from '../../services/tool-store.service';
import {OperationStoreService} from '../../services/operation-store.service';
import {MeasureStoreService} from '../../services/measure-store.service';
import {IngredientInterface} from '../../interfaces/ingredient';
import {MeasureInterface} from '../../interfaces/measure';
import {ToolInterface} from '../../interfaces/tool';
import {ActionInterface} from '../../interfaces/action';
import {ActionStoreService} from '../../services/action-store.service';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationComponent implements OnInit {
  @Input() operation: OperationInterface;
  @Output() readonly formOutput = new EventEmitter<FormGroup>();

  form: FormGroup = new FormGroup({});
  actions: Observable<ActionInterface[]>;
  measures: Observable<MeasureInterface[]>;
  ingredients: Observable<IngredientInterface[]>;
  tools: Observable<ToolInterface[]>;
  operations: Observable<OperationInterface[]>;

  constructor(
    private formBuilder: FormBuilder,
    private actionStore: ActionStoreService,
    private ingredientStore: IngredientStoreService,
    private toolStore: ToolStoreService,
    private operationStore: OperationStoreService,
    private measureStore: MeasureStoreService,
  ) {}

  get measureIngredients(): FormArray {
    return (this.form.get('measureIngredients') as FormArray);
  }
  get measureIngredientsControls(): AbstractControl[] {
    return (this.form.get('measureIngredients') as FormArray).controls.sort(this.sortArray);
  }

  get measureTools(): FormArray {
    return (this.form.get('measureTools') as FormArray);
  }
  get measureToolsControls(): AbstractControl[] {
    return (this.form.get('measureTools') as FormArray).controls.sort(this.sortArray);
  }

  get measureOperations(): FormArray {
    return (this.form.get('measureOperations') as FormArray);
  }
  get measureOperationsControls(): AbstractControl[] {
    return (this.form.get('measureOperations') as FormArray).controls.sort(this.sortArray);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: this.formBuilder.control('', []),
      name: this.formBuilder.control('', []),
      action: this.formBuilder.control('', [Validators.required]),
      timing: this.formBuilder.control('', []),
      description: this.formBuilder.control('', []),
      measureIngredients: this.formBuilder.array([]),
      measureTools: this.formBuilder.array([]),
      measureOperations: this.formBuilder.array([]),
    });

    this.actions = (this.form.get('action') as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => this.filterActionName(typeof value === 'string' ? value : value.name))
    );

    this.formOutput.emit(this.form);
    if (this.operation) {
      this.initForm(this.operation);
    }
  }

  initForm(operation: OperationInterface): void {
    operation.measureIngredients.forEach(measureIngredient => {
      this.addMeasureIngredient(measureIngredient);
    });
    operation.measureTools.forEach(measureTool => {
      this.addMeasureTool(measureTool);
    });
    operation.measureOperations.forEach(measureOperation => {
      this.addMeasureOperation(measureOperation);
    });
  }

  private sortArray(a, b) {
    const aValue = a.get('order').value;
    const bValue = b.get('order').value;
    return aValue > bValue ? 1 : aValue === bValue ? 0 : -1;
  }

  displayName(object: {name: string}): string {
    return object && object.name ? object.name : '';
  }

  private filterActionName(name: string): ActionInterface[] {
    const filterValue = name.toLowerCase();
    return this.actionStore.entities.filter(action => action.name.toLowerCase().includes(filterValue));
  }

  private filterMeasureName(name: string): MeasureInterface[] {
    const filterValue = name.toLowerCase();
    return this.measureStore.entities.filter(measure => measure.name.toLowerCase().includes(filterValue));
  }

  addMeasureIngredient(measureIngredient: MeasureIngredientInterface = null): void {
    const measureIngredientForm: FormGroup = this.formBuilder.group({
      id: this.formBuilder.control('', []),
      order: this.formBuilder.control(this.measureIngredients.length + 1, []),
      quantity: this.formBuilder.control(1, [Validators.required]),
      measure: this.formBuilder.control('', []),
      ingredient: this.formBuilder.control('', [Validators.required]),
    });
    if (measureIngredient) {
      measureIngredientForm.patchValue(measureIngredient);
    }

    this.ingredients = measureIngredientForm.get('ingredient').valueChanges.pipe(
      startWith(''),
      map(value => this.filterIngredientName(typeof value === 'string' ? value : value.name))
    );

    this.measures = measureIngredientForm.get('measure').valueChanges.pipe(
      startWith(''),
      map(value => this.filterMeasureName(typeof value === 'string' ? value : value.name))
    );

    this.measureIngredients.push(measureIngredientForm);
  }

  deleteMeasureIngredient(i: number): void {
    this.measureIngredients.removeAt(i);
    this.measureIngredients.controls.forEach((measureIngredient: FormGroup, index) => {
      measureIngredient.get('order').patchValue(index + 1);
    });
  }

  changeOrderMeasureIngredient(i: number, value: number): void {
    const currentOrderValue = this.measureIngredientsControls[i].get('order').value;
    const newOrderValue = currentOrderValue + value;
    this.measureIngredientsControls[newOrderValue - 1].get('order').patchValue(currentOrderValue);
    this.measureIngredientsControls[currentOrderValue - 1].get('order').patchValue(newOrderValue);
  }

  private filterIngredientName(name: string): IngredientInterface[] {
    const filterValue = name.toLowerCase();
    return this.ingredientStore.entities.filter(ingredient => ingredient.name.toLowerCase().includes(filterValue));
  }

  addMeasureTool(measureTool: MeasureToolInterface = null): void {
    const measureToolForm: FormGroup = this.formBuilder.group({
      id: this.formBuilder.control('', []),
      order: this.formBuilder.control(this.measureTools.length + 1, []),
      quantity: this.formBuilder.control(1, [Validators.required]),
      measure: this.formBuilder.control('', []),
      tool: this.formBuilder.control('', [Validators.required]),
    });
    if (measureTool) {
      measureToolForm.patchValue(measureTool);
    }

    this.tools = measureToolForm.get('tool').valueChanges.pipe(
      startWith(''),
      map(value => this.filterToolName(typeof value === 'string' ? value : value.name))
    );

    this.measures = measureToolForm.get('measure').valueChanges.pipe(
      startWith(''),
      map(value => this.filterMeasureName(typeof value === 'string' ? value : value.name))
    );

    this.measureTools.push(measureToolForm);
  }

  deleteMeasureTool(i: number): void {
    this.measureTools.removeAt(i);
    this.measureTools.controls.forEach((measureTool: FormGroup, index) => {
      measureTool.get('order').patchValue(index + 1);
    });
  }

  changeOrderMeasureTool(i: number, value: number): void {
    const currentOrderValue = this.measureToolsControls[i].get('order').value;
    const newOrderValue = currentOrderValue + value;
    this.measureToolsControls[newOrderValue - 1].get('order').patchValue(currentOrderValue);
    this.measureToolsControls[currentOrderValue - 1].get('order').patchValue(newOrderValue);
  }

  private filterToolName(name: string): ToolInterface[] {
    const filterValue = name.toLowerCase();
    return this.toolStore.entities.filter(tool => tool.name.toLowerCase().includes(filterValue));
  }

  addMeasureOperation(measureOperation: MeasureOperationInterface = null): void {
    const measureOperationForm: FormGroup = this.formBuilder.group({
      id: this.formBuilder.control('', []),
      order: this.formBuilder.control(this.measureOperations.length + 1, []),
      quantity: this.formBuilder.control(1, [Validators.required]),
      measure: this.formBuilder.control('', []),
      operation: this.formBuilder.control('', [Validators.required]),
    });
    if (measureOperation) {
      measureOperationForm.patchValue(measureOperation);
    }

    this.operations = measureOperationForm.get('operation').valueChanges.pipe(
      startWith(''),
      map(value => this.filterOperationName(typeof value === 'string' ? value : value.name))
    );

    this.measures = measureOperationForm.get('measure').valueChanges.pipe(
      startWith(''),
      map(value => this.filterMeasureName(typeof value === 'string' ? value : value.name))
    );

    this.measureOperations.push(measureOperationForm);
  }

  deleteMeasureOperation(i: number): void {
    this.measureOperations.removeAt(i);
    this.measureOperations.controls.forEach((measureOperation: FormGroup, index) => {
      measureOperation.get('order').patchValue(index + 1);
    });
  }

  changeOrderMeasureOperation(i: number, value: number): void {
    const currentOrderValue = this.measureOperationsControls[i].get('order').value;
    const newOrderValue = currentOrderValue + value;
    this.measureOperationsControls[newOrderValue - 1].get('order').patchValue(currentOrderValue);
    this.measureOperationsControls[currentOrderValue - 1].get('order').patchValue(newOrderValue);
  }

  private filterOperationName(name: string): OperationInterface[] {
    const filterValue = name.toLowerCase();
    return this.operationStore.entities.filter(operation => operation.name.toLowerCase().includes(filterValue));
  }
}

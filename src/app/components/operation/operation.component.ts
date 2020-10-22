import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {
  OperationInterface,
  OperationMeasureIngredientInterface,
  OperationMeasureOperationInterface,
  OperationMeasureToolInterface
} from '../../interfaces/operation';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FamilyInterface} from '../../interfaces/family';
import {FamilyStoreService} from '../../services/family-store.service';
import {MatterEnum} from '../../enums/matter';
import {IngredientStoreService} from '../../services/ingredient-store.service';
import {ToolStoreService} from '../../services/tool-store.service';
import {OperationStoreService} from '../../services/operation-store.service';
import {MeasureStoreService} from '../../services/measure-store.service';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss']
})
export class OperationComponent implements OnInit {
  @Input() operation: OperationInterface;
  @Output() readonly formOutput = new EventEmitter<FormGroup>();

  form: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private ingredientStore: IngredientStoreService,
    private toolStore: ToolStoreService,
    private operationStore: OperationStoreService,
    private measureStore: MeasureStoreService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
      action: this.formBuilder.control('', [Validators.required]),
      timing: this.formBuilder.control('', [Validators.required]),
      description: this.formBuilder.control('', []),
      resultat: this.formBuilder.control('', []),
      measureIngredients: this.formBuilder.array([]),
      measureTools: this.formBuilder.array([]),
      measureOperations: this.formBuilder.array([]),
    });
    this.formOutput.emit(this.form);
  }

  addMeasureIngredient(measureIngredient: OperationMeasureIngredientInterface = null): void {
    (this.form.get('measureIngredients') as FormArray).push(this.formBuilder.group({
      order: this.formBuilder.control('', []),
      quantity: this.formBuilder.control('', [Validators.required]),
      measure: this.formBuilder.control('', []),
      ingredient: this.formBuilder.control('', [Validators.required]),
    }));
  }

  addMeasureTool(measureTool: OperationMeasureToolInterface = null): void {
    (this.form.get('measureTools') as FormArray).push(this.formBuilder.group({
      order: this.formBuilder.control('', []),
      quantity: this.formBuilder.control('', [Validators.required]),
      measure: this.formBuilder.control('', []),
      tool: this.formBuilder.control('', [Validators.required]),
    }));
  }

  addMeasureOperation(measureOperation: OperationMeasureOperationInterface = null): void {
    (this.form.get('measureOperations') as FormArray).push(this.formBuilder.group({
      order: this.formBuilder.control('', []),
      quantity: this.formBuilder.control('', [Validators.required]),
      measure: this.formBuilder.control('', []),
      operation: this.formBuilder.control('', [Validators.required]),
    }));
  }
}

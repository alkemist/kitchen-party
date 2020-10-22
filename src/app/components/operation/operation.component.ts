import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {OperationInterface} from '../../interfaces/operation';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
  ) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required]),
    });
    this.formOutput.emit(this.form);
  }
}

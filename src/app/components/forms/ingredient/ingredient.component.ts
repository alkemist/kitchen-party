import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {IngredientModel} from '../../../models/ingredient.model';
import {KeyObject} from '../../../models/other.model';

@Component({
  selector: 'app-form-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss']
})
export class FormIngredientComponent implements OnInit {
  @Input() ingredient: IngredientModel | undefined = undefined;
  @Input() loading = true;
  @Input() ingredientTypes: KeyObject[] = [];
  @Input() form: FormGroup = new FormGroup({});
  @Input() dialogMode = false;
  @Output() onSubmit = new EventEmitter<IngredientModel>();
  @Output() onRemove = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  constructor() {
  }

  get name(): FormControl {
    return this.form?.get('name') as FormControl;
  }

  get type(): FormControl {
    return this.form?.get('type') as FormControl;
  }

  get isLiquid(): FormControl {
    return this.form?.get('isLiquid') as FormControl;
  }

  ngOnInit(): void {
  }

  handleSubmit() {
    this.onSubmit.emit(this.form?.value);
  }

  remove() {
    this.onRemove.emit();
  }

  close() {
    this.onClose.emit();
  }
}
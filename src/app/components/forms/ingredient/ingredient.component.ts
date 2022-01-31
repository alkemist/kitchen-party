import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {IngredientModel} from '../../../models/ingredient.model';

@Component({
  selector: 'app-form-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss']
})
export class FormIngredientComponent implements OnInit {
  @Input() ingredient: IngredientModel | undefined = undefined;
  @Input() ingredientTypes: { key: string, label: string }[] = [];
  @Input() form: FormGroup = new FormGroup({});
  @Output() onSubmit = new EventEmitter<IngredientModel>();
  @Output() onRemove = new EventEmitter<void>();

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
    const formIngredient = new IngredientModel(this.form?.value);
    this.onSubmit.emit(formIngredient);
  }

  remove() {
    this.onRemove.emit();
  }
}

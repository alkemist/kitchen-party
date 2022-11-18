import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {IngredientTypeLabelEnum, IngredientTypes} from '@enums';
import {KeyLabelInterface} from '@interfaces';
import {IngredientModel} from '@models';

@Component({
  selector: 'app-form-ingredient',
  templateUrl: './form-ingredient.component.html',
  styleUrls: ['./form-ingredient.component.scss']
})
export class FormIngredientComponent implements OnInit {
  @Input() ingredient: IngredientModel | undefined = undefined;
  @Input() loading = true;
  @Input() ingredientTypes: KeyLabelInterface[] = [];
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  @Input() dialogMode = false;
  @Output() onSubmit = new EventEmitter<IngredientModel>();
  @Output() onRemove = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  constructor() {
  }

  get isFruitsOrVegetables(): boolean {
    return IngredientTypes.get(this.type.value) === IngredientTypeLabelEnum.fruits_vegetables_mushrooms;
  }

  get name(): UntypedFormControl {
    return this.form?.get('name') as UntypedFormControl;
  }

  get type(): UntypedFormControl {
    return this.form?.get('type') as UntypedFormControl;
  }

  get isLiquid(): UntypedFormControl {
    return this.form?.get('isLiquid') as UntypedFormControl;
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

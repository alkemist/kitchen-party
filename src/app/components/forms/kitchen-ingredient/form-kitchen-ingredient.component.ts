import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {IngredientModel, KitchenIngredientModel} from '@models';
import {KeyLabelInterface} from '@interfaces';

@Component({
  selector: 'app-form-kitchen-ingredient',
  templateUrl: './form-kitchen-ingredient.component.html',
  styleUrls: ['./form-kitchen-ingredient.component.scss'],
})
export class FormKitchenIngredientComponent implements OnInit {
  @Input() i: number = 0;
  @Input() kitchenIngredient: KitchenIngredientModel | undefined = undefined;
  @Input() loading = true;
  @Input() measureUnits: KeyLabelInterface[] = [];
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
  @Input() ingredients: IngredientModel[] = [];
  @Output() searchIngredientEvent: EventEmitter<{ query: string }> = new EventEmitter<{ query: string }>();

  constructor() {
  }

  ngOnInit(): void {

  }

  searchIngredient(event: { query: string }): void {
    this.searchIngredientEvent.emit(event);
  }
}

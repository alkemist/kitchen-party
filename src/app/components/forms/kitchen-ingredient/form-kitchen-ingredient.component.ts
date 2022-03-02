import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IngredientModel, KitchenIngredientModel, RecipeModel } from '../../../models';
import { KeyLabelInterface } from '../../../interfaces';

@Component({
  selector: 'app-form-kitchen-ingredient',
  templateUrl: './form-kitchen-ingredient.component.html',
  styleUrls: [ './form-kitchen-ingredient.component.scss' ],
})
export class FormKitchenIngredientComponent implements OnInit {
  @Input() i: number = 0;
  @Input() kitchenIngredient: KitchenIngredientModel | undefined = undefined;
  @Input() loading = true;
  @Input() isKitchen = true;
  @Input() measureUnits: KeyLabelInterface[] = [];
  @Input() form: FormGroup = new FormGroup({});
  @Input() ingredientsOrRecipes: (IngredientModel | RecipeModel)[] = [];
  @Output() searchIngredientOrRecipeEvent: EventEmitter<{ query: string }> = new EventEmitter<{ query: string }>();

  constructor() {
  }

  ngOnInit(): void {

  }

  searchIngredientOrRecipe(event: { query: string }): void {
    this.searchIngredientOrRecipeEvent.emit(event);
  }
}

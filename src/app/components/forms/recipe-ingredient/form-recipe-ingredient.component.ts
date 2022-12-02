import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {IngredientModel, KitchenIngredientModel, RecipeModel} from '@models';
import {KeyLabelInterface} from '@interfaces';

@Component({
  selector: 'app-form-recipe-ingredient',
  templateUrl: './form-recipe-ingredient.component.html',
  styleUrls: ['./form-recipe-ingredient.component.scss'],
})
export class FormRecipeIngredientComponent implements OnInit {
  @Input() i: number = 0;
  @Input() kitchenIngredient: KitchenIngredientModel | undefined = undefined;
  @Input() loading = true;
  @Input() measureUnits: KeyLabelInterface[] = [];
  @Input() form: UntypedFormGroup = new UntypedFormGroup({});
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

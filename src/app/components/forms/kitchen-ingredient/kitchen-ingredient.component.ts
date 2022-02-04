import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IngredientModel} from "../../../models/ingredient.model";
import {FormGroup} from "@angular/forms";
import {RecipeModel} from "../../../models/recipe.model";
import {KitchenIngredientModel} from "../../../models/kitchen-ingredient.model";

@Component({
  selector: 'app-form-kitchen-ingredient',
  templateUrl: './kitchen-ingredient.component.html',
  styleUrls: ['./kitchen-ingredient.component.scss']
})
export class FormKitchenIngredientComponent implements OnInit {
  @Input() i: number = 0;
  @Input() kitchenIngredient: KitchenIngredientModel | undefined = undefined;
  @Input() loading = true;
  @Input() measureUnits: { key: string, label: string }[] = [];
  @Input() form: FormGroup = new FormGroup({});
  @Input() ingredientsOrRecipes: (IngredientModel | RecipeModel)[] = [];
  @Output() searchIngredientOrRecipeEvent: EventEmitter<{ query: string }> = new EventEmitter<{ query: string }>();

  constructor() {
  }

  ngOnInit(): void {
  }

  searchIngredientOrRecipe(event: { query: string }): void {
    this.searchIngredientOrRecipeEvent.emit(event)
  }
}

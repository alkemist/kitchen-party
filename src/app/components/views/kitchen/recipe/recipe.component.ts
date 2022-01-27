import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {MeasureUnitEnum} from '../../../../enums/measure-unit.enum';
import {RecipeTypeEnum} from '../../../../enums/recipe-type.enum';
import {IngredientModel} from '../../../../models/ingredient.model';
import {RecipeInterface, RecipeModel} from '../../../../models/recipe.model';
import {IngredientService} from '../../../../services/ingredient.service';
import {RecipeService} from '../../../../services/recipe.service';
import {EnumHelper} from '../../../../tools/enum.helper';
import {FormComponent} from '../../../../tools/form.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  host: {
    class: 'flex flex-grow-1 w-full'
  }
})
export class RecipeComponent extends FormComponent<RecipeModel> implements OnInit {
  override document = new RecipeModel({} as RecipeInterface);
  recipeTypes = EnumHelper.enumToObject(RecipeTypeEnum);
  measureUnits = EnumHelper.enumToObject(MeasureUnitEnum);
  ingredients: IngredientModel[] = [];
  recipes: RecipeModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    routerService: Router,
    translateService: TranslateService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
  ) {
    super('recipe', recipeService, routerService, confirmationService, translateService, messageService);
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      type: new FormControl('', []),
      cookingDuration: new FormControl('', []),
      preparationDuration: new FormControl('', []),
      waitingDuration: new FormControl('', []),
      nbSlices: new FormControl('', []),
      recipeIngredients: new FormArray([RecipeComponent.createRecipeIngredient()]),
      instructions: new FormArray([RecipeComponent.createInstructionRow()])
    });
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get recipeIngredients(): FormArray {
    return this.form.get('recipeIngredients') as FormArray;
  }

  get instructionRows(): FormArray {
    return this.form.get('instructions') as FormArray;
  }

  private static createRecipeIngredient(): FormGroup {
    return new FormGroup({
      ingredient: new FormControl('', []),
      recipe: new FormControl('', []),
      quantity: new FormControl('', []),
      measure: new FormControl('', []),
      unit: new FormControl('', []),
      main: new FormControl('', []),
      base: new FormControl('', []),
    });
  }

  private static createInstructionRow(): FormControl {
    return new FormControl('', []);
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data => {
        if (data && data['recipe']) {
          this.document = data['recipe'];
          this.form.patchValue(this.document);
        }
      }));
    this.translateService.getTranslation('fr').subscribe(() => {
      this.recipeTypes = this.recipeTypes.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
      this.recipeTypes.unshift({key: '', label: this.translateService.instant('None')});
      this.measureUnits = this.measureUnits.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
      this.measureUnits.unshift({key: '', label: this.translateService.instant('None')});
    });
  }

  async handleSubmit(): Promise<void> {
    const formRecipe = new RecipeModel(this.form.value);
    console.log('handleSubmit', formRecipe);
    //await this.preSubmit(formRecipe);
  }

  addRecipeIngredient(): void {
    this.recipeIngredients.push(RecipeComponent.createRecipeIngredient());
  }

  removeRecipeIngredient(index: number): void {
    this.recipeIngredients.removeAt(index);
  }

  addInstructionRow(): void {
    this.instructionRows.push(RecipeComponent.createInstructionRow());
  }

  removeInstructionRow(index: number): void {
    this.instructionRows.removeAt(index);
  }

  searchIngredient(event: { query: string }) {
    this.ingredientService.search(event.query).then(ingredients => {
      this.ingredients = ingredients;
    });
  }

  searchRecipe(event: { query: string }) {
    this.recipeService.search(event.query).then(recipes => {
      this.recipes = recipes;
    });
  }
}

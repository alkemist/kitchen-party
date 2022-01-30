import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {MeasureUnitEnum} from '../../../../enums/measure-unit.enum';
import {RecipeTypeEnum} from '../../../../enums/recipe-type.enum';
import {IngredientModel} from '../../../../models/ingredient.model';
import {RecipeIngredientFormInterface, RecipeIngredientModel} from '../../../../models/recipe-ingredient.model';
import {RecipeInterface, RecipeModel} from '../../../../models/recipe.model';
import {IngredientService} from '../../../../services/ingredient.service';
import {RecipeService} from '../../../../services/recipe.service';
import {SearchService} from '../../../../services/search.service';
import {EnumHelper} from '../../../../tools/enum.helper';
import {FormComponent} from '../../../../tools/form.component';

function recipeIngredientFormValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const recipeIngredientForm: RecipeIngredientFormInterface = control.value;
    const isValid = !recipeIngredientForm.unitOrMeasure
      || recipeIngredientForm.quantity && recipeIngredientForm.unitOrMeasure;
    return isValid ? null : {invalid: {value: control.value}};
  };
}

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class RecipeComponent extends FormComponent<RecipeModel> implements OnInit {
  override document = new RecipeModel({} as RecipeInterface);
  recipeTypes = EnumHelper.enumToObject(RecipeTypeEnum);
  measureUnits = EnumHelper.enumToObject(MeasureUnitEnum);
  ingredientsOrRecipes: (IngredientModel | RecipeModel)[] = [];
  recipes: RecipeModel[] = [];
  private ingredientTranslation: string = 'Ingredient';

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private searchService: SearchService,
    routerService: Router,
    translateService: TranslateService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    private http: HttpClient
  ) {
    super('recipe', recipeService, routerService, confirmationService, translateService, messageService);
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      type: new FormControl('', []),
      source: new FormControl('', []),
      cookingDuration: new FormControl('', []),
      preparationDuration: new FormControl('', []),
      waitingDuration: new FormControl('', []),
      nbSlices: new FormControl('', []),
      recipeIngredientForms: new FormArray([RecipeComponent.createRecipeIngredient()]),
      instructions: new FormArray([RecipeComponent.createInstructionRow()], [Validators.required])
    });
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get recipeIngredients(): FormArray {
    return this.form.get('recipeIngredientForms') as FormArray;
  }

  get instructionRows(): FormArray {
    return this.form.get('instructions') as FormArray;
  }

  private static createRecipeIngredient(): FormGroup {
    return new FormGroup({
      quantity: new FormControl('', []),
      unitOrMeasure: new FormControl('', []),
      ingredientOrRecipe: new FormControl('', [Validators.required]),
      isMain: new FormControl('', []),
      isBase: new FormControl('', []),
    }, [recipeIngredientFormValidator()]);
  }

  private static createInstructionRow(): FormControl {
    return new FormControl('', [Validators.required]);
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data => {
        if (data && data['recipe']) {
          this.document = data['recipe'];
          console.log(this.document);
          this.form.patchValue(this.document);
          this.recipeIngredients.removeAt(0);
          this.instructionRows.removeAt(0);

          this.document.recipeIngredients.forEach((recipeIngredient, i) => {
            this.addRecipeIngredient();

            const recipeIngredientForm = {...recipeIngredient} as RecipeIngredientFormInterface;
            recipeIngredientForm.ingredientOrRecipe = recipeIngredient.recipe ? recipeIngredient.recipe : recipeIngredient.ingredient!;
            recipeIngredientForm.unitOrMeasure = recipeIngredient.measure ? recipeIngredient.measure : recipeIngredient.unit!;

            this.recipeIngredients.at(i).patchValue(recipeIngredientForm);
          });
          this.document.instructions?.forEach((instruction, i) => {
            this.addInstructionRow();

            this.instructionRows.at(i).patchValue(instruction);
          });
        }
      }));
    this.translateService.getTranslation('fr').subscribe(() => {
      this.ingredientTranslation = this.translateService.instant('Ingredient');
      this.recipeTypes = this.recipeTypes.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
      this.recipeTypes.unshift({key: '', label: this.translateService.instant('None')});
      this.measureUnits = this.measureUnits.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
      this.measureUnits.unshift({key: '', label: this.translateService.instant('None')});
    });

    /*this.ingredientService.refreshList().then(async (ingredients) => {
      this.http.get('/assets/kitchen.json').subscribe(async (kitchen: any) => {
        console.log('-- Kitchen', kitchen);
      });
    });*/
    /*this.recipeService.refreshList().then(async (recipes) => {
      for (const recipe of recipes) {
        for (const recipeIngredient of recipe.recipeIngredients) {

        }
      }
    });*/
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

  searchIngredientOrRecipe(event: { query: string }): void {
    this.searchService.searchIngredients(event.query).then(ingredientsOrRecipes => {
      this.ingredientsOrRecipes = ingredientsOrRecipes;
    });
  }

  recipeIngredientToString(i: number): string {
    const recipeIngredientData: RecipeIngredientFormInterface = this.recipeIngredients.at(i).value;
    const recipeIngredient = RecipeIngredientModel.import(recipeIngredientData);
    const recipeIngredientString = recipeIngredient.toString(this.measureUnits);
    return recipeIngredientString !== '' ? recipeIngredientString : `${this.ingredientTranslation} ${i + 1}`;
  }

  async handleSubmit(): Promise<void> {
    const formRecipe = new RecipeModel(this.form.value);
    for (let i = 0; i < this.recipeIngredients.length; i++) {
      formRecipe.recipeIngredients.push(RecipeIngredientModel.import(this.recipeIngredients.at(i).value));
    }

    await this.preSubmit(formRecipe);
  }
}

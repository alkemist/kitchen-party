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

function recipeIngredientFormValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const recipeIngredientForm: RecipeIngredientFormInterface = control.value;
    const isValid = !recipeIngredientForm.unitOrMeasure
      || recipeIngredientForm.quantity && recipeIngredientForm.unitOrMeasure;
    return isValid ? null : {invalid: {value: control.value}};
  };
}

@Component({
  selector: 'app-back-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class RecipeComponent implements OnInit {
  recipe = new RecipeModel({} as RecipeInterface);
  recipeTypes = EnumHelper.enumToObject(RecipeTypeEnum);
  measureUnits = EnumHelper.enumToObject(MeasureUnitEnum);
  ingredientsOrRecipes: (IngredientModel | RecipeModel)[] = [];
  recipes: RecipeModel[] = [];
  form: FormGroup = new FormGroup({});
  loading = true;
  error: string = '';
  private ingredientTranslation: string = 'Ingredient';

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private searchService: SearchService,
    private routerService: Router,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      type: new FormControl('', []),
      image: new FormControl('', []),
      source: new FormControl('', []),
      cookingDuration: new FormControl('', []),
      preparationDuration: new FormControl('', []),
      waitingDuration: new FormControl('', []),
      nbSlices: new FormControl('', []),
      recipeIngredientForms: new FormArray([RecipeComponent.createRecipeIngredient()]),
      instructions: new FormArray([RecipeComponent.createInstructionRow()], [Validators.required])
    });
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
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
          this.recipe = data['recipe'];
          this.form.patchValue(this.recipe);
          this.recipeIngredients.removeAt(0);
          this.instructionRows.removeAt(0);

          this.recipe.orderedRecipeIngredients.forEach((recipeIngredient, i) => {
            this.addRecipeIngredient();

            const recipeIngredientForm = {...recipeIngredient} as RecipeIngredientFormInterface;
            recipeIngredientForm.ingredientOrRecipe = recipeIngredient.recipe ? recipeIngredient.recipe : recipeIngredient.ingredient!;
            recipeIngredientForm.unitOrMeasure = recipeIngredient.measure ? recipeIngredient.measure : recipeIngredient.unit!;

            this.recipeIngredients.at(i).patchValue(recipeIngredientForm);
          });
          this.recipe.instructions?.forEach((instruction, i) => {
            this.addInstructionRow();

            this.instructionRows.at(i).patchValue(instruction);
          });
          this.loading = false;
        }
      }));
    this.translateService.getTranslation('fr').subscribe(() => {
      this.ingredientTranslation = this.translateService.instant('Ingredient');
      this.recipeTypes = this.recipeTypes.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
      this.measureUnits = this.measureUnits.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
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

  async preSubmit(formDocument: RecipeModel): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.recipe.id) {
        formDocument.id = this.recipe.id;
      }

      const checkExist = !this.recipe.id || formDocument.name !== this.recipe.name;

      if (checkExist) {
        this.recipeService.exist(formDocument.name!).then(async exist => {
          if (exist) {
            return this.name.setErrors({'exist': true});
          }
          await this.submit(formDocument);
        });
      } else {
        await this.submit(formDocument);
      }
    }
  }

  async submit(localDocument: RecipeModel): Promise<void> {
    if (this.recipe.id) {
      this.recipe = await this.recipeService.update(localDocument);
      this.messageService.add({
        severity: 'success',
        detail: this.translateService.instant(`Updated recipe`)
      });
    } else {
      this.recipe = await this.recipeService.add(localDocument);
      this.messageService.add({
        severity: 'success',
        detail: this.translateService.instant(`Added recipe`)
      });
    }
    await this.routerService.navigate(['/', 'recipe', this.recipe.slug]);
  }

  async remove(): Promise<void> {
    this.confirmationService.confirm({
      message: this.translateService.instant('Are you sure you want to delete it ?'),
      accept: async () => {
        await this.recipeService.remove(this.recipe);
        await this.routerService.navigate(['/', 'recipe' + 's']);
        this.messageService.add({
          severity: 'success',
          detail: this.translateService.instant(`Deleted recipe`)
        });
      }
    });
  }
}

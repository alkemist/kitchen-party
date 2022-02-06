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
import {ConfirmationService, FilterService, MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {MeasureUnitEnum, MeasureUnits} from '../../../../enums/measure-unit.enum';
import {RecipeTypeEnum} from '../../../../enums/recipe-type.enum';
import {IngredientModel} from '../../../../models/ingredient.model';
import {KeyObject} from '../../../../models/other.model';
import {RecipeIngredientFormInterface, RecipeIngredientModel} from '../../../../models/recipe-ingredient.model';
import {RecipeInterface, RecipeModel} from '../../../../models/recipe.model';
import {IngredientService} from '../../../../services/ingredient.service';
import {RecipeService} from '../../../../services/recipe.service';
import {SearchService} from '../../../../services/search.service';
import {EnumHelper} from '../../../../tools/enum.helper';
import {slugify} from '../../../../tools/slugify';
import {DialogIngredientComponent} from '../../../dialogs/ingredient/ingredient.component';

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
  unitsOrMeasures: KeyObject[] = [];
  ingredientsOrRecipes: (IngredientModel | RecipeModel)[] = [];
  form: FormGroup = new FormGroup({});
  loading = true;
  error: string = '';
  indexRecipeIngredient = 0;

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
    private dialogService: DialogService,
    private filterService: FilterService,
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
      recipeIngredientForms: new FormArray([RecipeComponent.createRecipeIngredient()], [Validators.required]),
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
    }, [recipeIngredientFormValidator()]);
  }

  private static createInstructionRow(): FormControl {
    return new FormControl('', [Validators.required]);
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data => {
        if (data && data['recipe']) {
          this.loadTranslations(() => {
            this.loadData(data['recipe']);
          });

          this.loading = false;
        } else {
          this.loading = false;
        }
      }));
  }

  loadTranslations(callback: () => void) {
    this.translateService.getTranslation('fr').subscribe(() => {
      this.ingredientTranslation = this.translateService.instant('Ingredient');
      this.recipeTypes = this.recipeTypes.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
      this.measureUnits = this.measureUnits.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
      this.measureUnits = this.measureUnits.concat(this.recipeService.customMeasures);
      callback();
    });
  }

  loadData(recipe: RecipeModel) {
    this.recipe = recipe;

    this.form.patchValue(this.recipe);
    this.recipeIngredients.removeAt(0);
    this.instructionRows.removeAt(0);

    this.recipe.orderedRecipeIngredients.forEach((recipeIngredient, i) => {
      this.addRecipeIngredient();

      const recipeIngredientForm = {...recipeIngredient} as RecipeIngredientFormInterface;
      recipeIngredientForm.ingredientOrRecipe = recipeIngredient.recipe ? recipeIngredient.recipe : recipeIngredient.ingredient!;
      recipeIngredientForm.unitOrMeasure = recipeIngredient.unit
        ? MeasureUnits[recipeIngredient.unit] ? this.translateService.instant(MeasureUnits[recipeIngredient.unit]) : recipeIngredient.unit
        : recipeIngredient.measure;

      this.recipeIngredients.at(i).patchValue(recipeIngredientForm);
    });

    this.recipe.instructions?.forEach((instruction, i) => {
      this.addInstructionRow();

      this.instructionRows.at(i).patchValue(instruction);
    });
  }

  addRecipeIngredient(): void {
    this.recipeIngredients.push(RecipeComponent.createRecipeIngredient());
    this.indexRecipeIngredient = this.recipeIngredients.length - 1;
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
    const recipeIngredient = RecipeIngredientModel.import(recipeIngredientData, this.measureUnits);
    const recipeIngredientString = recipeIngredient.toString(this.measureUnits);
    return recipeIngredientString !== '' ? recipeIngredientString : `${this.ingredientTranslation} ${i + 1}`;
  }

  async handleSubmit(): Promise<void> {
    const formRecipe = new RecipeModel(this.form.value);
    for (let i = 0; i < this.recipeIngredients.length; i++) {
      formRecipe.recipeIngredients.push(RecipeIngredientModel.import(this.recipeIngredients.at(i).value, this.measureUnits));
    }

    await this.preSubmit(formRecipe);
  }

  async preSubmit(formDocument: RecipeModel): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.recipe.id) {
        formDocument.id = this.recipe.id;
      }

      const checkExist = !this.recipe.id || slugify(formDocument.name) !== slugify(this.recipe.name);

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
      this.loading = true;
      this.recipeService.update(localDocument).then(async recipe => {
        this.recipe = recipe!;
        this.loading = false;
        await this.messageService.add({
          severity: 'success',
          detail: this.translateService.instant(`Updated recipe`)
        });
        await this.routerService.navigate(['/', 'recipe', this.recipe.slug]);
      });
    } else {
      this.recipeService.add(localDocument).then(recipe => {
        this.recipe = recipe!;
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: this.translateService.instant(`Added recipe`)
        });
        this.routerService.navigate(['/', 'recipe', this.recipe.slug]);
      });
    }
  }

  async remove(): Promise<void> {
    this.confirmationService.confirm({
      message: this.translateService.instant('Are you sure you want to delete it ?'),
      accept: () => {
        this.loading = true;
        this.recipeService.remove(this.recipe).then(() => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            detail: this.translateService.instant(`Deleted recipe`)
          });
          this.routerService.navigate(['/', 'recipes']);
        });
      }
    });
  }

  showNewIngredientModal() {
    this.dialogService.open(DialogIngredientComponent, {
      showHeader: false,
      width: '70%'
    });
  }

  searchUnitOrMeasure($event: any) {
    this.unitsOrMeasures = this.measureUnits.filter(measureOrUnit => {
      return this.filterService.filters.contains(measureOrUnit.key, $event.query);
    });
  }

  getFormGroupRecipeIngredient(i: number): FormGroup {
    return this.recipeIngredients.at(i) as FormGroup;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DietTypeEnum, MeasureUnitEnum, MeasureUnits, RecipeTypeEnum } from '../../../../enums';
import { KeyLabelInterface, RecipeIngredientFormInterface, RecipeInterface } from '../../../../interfaces';
import { IngredientModel, RecipeIngredientModel, RecipeModel } from '../../../../models';
import {
  IngredientService,
  RecipeService,
  SearchService,
  TranslatorService,
  UploadService
} from '../../../../services';
import { EnumHelper, slugify } from '../../../../tools';
import { recipeIngredientValidator } from '../../../../validators/recipeIngredient.validator';
import { DialogIngredientComponent } from '../../../dialogs/ingredient/ingredient.component';

@Component({
  selector: 'app-back-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: [ './recipe.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class RecipeComponent implements OnInit {
  recipe = new RecipeModel({} as RecipeInterface);
  DietTypeEnum = DietTypeEnum;
  recipeTypes: KeyLabelInterface[] = [];
  measureUnits: KeyLabelInterface[] = [];
  unitsOrMeasures: KeyLabelInterface[] = [];
  ingredientsOrRecipes: (IngredientModel | RecipeModel)[] = [];
  form: FormGroup = new FormGroup({});
  loading = true;
  uploading = false;
  error: string = '';
  indexRecipeIngredient = 0;
  coverFiles: File[] = [];
  uploadClass: string = '';
  private ingredientTranslation: string = '';

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private searchService: SearchService,
    private routerService: Router,
    private translatorService: TranslatorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private filterService: FilterService,
    private uploadService: UploadService,
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      type: new FormControl('', []),
      image: new FormControl('', []),
      imagePath: new FormControl('', []),
      source: new FormControl('', []),
      cookingDuration: new FormControl('', []),
      preparationDuration: new FormControl('', []),
      waitingDuration: new FormControl('', []),
      nbSlices: new FormControl('', []),
      recipeIngredientForms: new FormArray([ RecipeComponent.createRecipeIngredient() ], []),
      instructions: new FormArray([ RecipeComponent.createInstructionRow() ], [])
    });
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get image(): FormControl {
    return this.form.get('image') as FormControl;
  }

  get imagePath(): FormControl {
    return this.form.get('imagePath') as FormControl;
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
      ingredientOrRecipe: new FormControl('', [ Validators.required ]),
      optionCarne: new FormControl('', []),
      optionVege: new FormControl('', []),
      optionVegan: new FormControl('', []),
    }, [ recipeIngredientValidator() ]);
  }

  private static createInstructionRow(): FormControl {
    return new FormControl('', [ Validators.required ]);
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (async (data: any) => {
        this.ingredientTranslation = await this.translatorService.instant('Ingredients');
        this.recipeTypes = await this.translatorService.translateLabels(EnumHelper.enumToObject(RecipeTypeEnum));
        this.measureUnits = await this.translatorService.translateLabels(EnumHelper.enumToObject(MeasureUnitEnum));
        this.measureUnits = this.measureUnits.concat(this.recipeService.customMeasures);

        if (data && data['recipe']) {
          this.loadData(data['recipe']);
        }
        this.loading = false;
      }));
  }

  async loadData(recipe: RecipeModel) {
    this.recipe = recipe;

    this.form.patchValue(this.recipe);
    this.recipeIngredients.removeAt(0);
    this.instructionRows.removeAt(0);

    for (const recipeIngredient of this.recipe.orderedRecipeIngredients) {
      const i = this.recipe.orderedRecipeIngredients.indexOf(recipeIngredient);
      this.addRecipeIngredient();

      const recipeIngredientForm = { ...recipeIngredient } as RecipeIngredientFormInterface;
      recipeIngredientForm.ingredientOrRecipe = recipeIngredient.recipe ? recipeIngredient.recipe : recipeIngredient.ingredient!;
      recipeIngredientForm.unitOrMeasure = recipeIngredient.unit
        ? MeasureUnits[recipeIngredient.unit] ? await this.translatorService.instant(MeasureUnits[recipeIngredient.unit]) : recipeIngredient.unit
        : recipeIngredient.measure;

      this.recipeIngredients.at(i).patchValue(recipeIngredientForm);
    }

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
    this.searchService.searchIngredientsOrRecipes(event.query).then(ingredientsOrRecipes => {
      this.ingredientsOrRecipes = ingredientsOrRecipes;
    });
  }

  recipeIngredientToString(i: number): string {
    const recipeIngredientData: RecipeIngredientFormInterface = this.recipeIngredients.at(i).value;
    const recipeIngredient = RecipeIngredientModel.format(recipeIngredientData, this.measureUnits);
    const recipeIngredientString = RecipeIngredientModel.recipeIngredientToString(recipeIngredient, this.measureUnits);
    return recipeIngredientString !== '' ? recipeIngredientString : `${ this.ingredientTranslation } ${ i + 1 }`;
  }

  async handleSubmit(): Promise<void> {
    const formRecipe = { ...this.form.value, recipeIngredients: [] };
    for (let i = 0; i < this.recipeIngredients.length; i++) {
      formRecipe.recipeIngredients.push(RecipeIngredientModel.format(this.recipeIngredients.at(i).value, this.measureUnits));
    }

    await this.preSubmit(formRecipe);
  }

  async preSubmit(formDocument: RecipeInterface): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.recipe.id) {
        formDocument.id = this.recipe.id;
      }

      const checkExist = !this.recipe.id || slugify(formDocument.name) !== slugify(this.recipe.name);

      if (checkExist) {
        this.recipeService.exist(formDocument.name!).then(async exist => {
          if (exist) {
            return this.name.setErrors({ 'exist': true });
          }
          await this.submit(formDocument);
        });
      } else {
        await this.submit(formDocument);
      }
    }
  }

  async submit(localDocument: RecipeInterface): Promise<void> {
    if (this.recipe.id) {
      this.loading = true;
      this.recipeService.update(localDocument).then(async recipe => {
        this.loading = false;
        await this.messageService.add({
          severity: 'success',
          detail: await this.translatorService.instant(`Updated recipe`)
        });
        await this.routerService.navigate([ '/', 'recipe', recipe!.slug ]);
      });
    } else {
      this.recipeService.add(localDocument).then(async recipe => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: await this.translatorService.instant(`Added recipe`)
        });
        this.routerService.navigate([ '/', 'recipe', recipe!.slug ]);
      });
    }
  }

  async remove(): Promise<void> {
    this.confirmationService.confirm({
      message: await this.translatorService.instant('Are you sure you want to delete it ?'),
      accept: () => {
        this.loading = true;
        this.recipeService.remove(this.recipe).then(async () => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            detail: await this.translatorService.instant(`Deleted recipe`)
          });
          this.routerService.navigate([ '/', 'recipes' ]);
        });
      }
    });
  }

  showNewIngredientModal() {
    this.dialogService.open(DialogIngredientComponent, {
      showHeader: false,
      width: '70%',
      styleClass: 'ingredient'
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

  selectImage($event: { files: File[], currentFiles: File[] }) {
    this.uploadClass = $event.currentFiles.length > 0 ? 'withFiles' : '';
  }

  removeImage() {
    this.uploadClass = '';
  }

  async uploadImage($event: { files: File[] }) {
    if ($event.files.length > 0) {
      this.uploading = true;
      this.uploadService.upload($event.files[0]).then(async (image) => {
        this.uploading = false;
        if (image) {
          this.coverFiles = [];
          this.image.patchValue(image.name);
          this.imagePath.patchValue(image.path);
        }
      });
    }
  }

  removeCurrentImage() {
    this.image.patchValue('');
    this.imagePath.patchValue('');
  }
}

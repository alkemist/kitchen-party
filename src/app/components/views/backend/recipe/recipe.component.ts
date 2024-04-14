import { AfterViewChecked, ChangeDetectorRef, Component, computed, OnInit, WritableSignal } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogIngredientComponent } from '@components';
import { DietTypeLabelEnum, MeasureUnitLabelEnum, MeasureUnits, RecipeTypeLabelEnum } from '@enums';
import { KeyLabelInterface, RecipeIngredientFormInterface, RecipeInterface, RecipeV2FrontInterface } from '@interfaces';
import { IngredientModel, RecipeIngredientModel, RecipeModel, RelationIngredientModel } from '@models';
import {
  IngredientService,
  RecipeService,
  RecipeV2Service,
  SearchService,
  TranslatorService,
  UploadService
} from '@services';
import { EnumHelper } from '@tools';
import { recipeIngredientValidator } from '@validators';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Observe } from '@alkemist/ngx-state-manager';
import { RecipeV2State } from '@stores';

@Component({
  selector: 'app-back-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: [ './recipe.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class RecipeComponent implements OnInit, AfterViewChecked {
  recipe = new RecipeModel({});
  DietTypeEnum = DietTypeLabelEnum;
  recipeTypes: KeyLabelInterface[] = [];
  measureUnits: KeyLabelInterface[] = [];
  unitsOrMeasures: KeyLabelInterface[] = [];
  ingredientsOrRecipes: (IngredientModel | RecipeModel)[] = [];
  form: UntypedFormGroup = new UntypedFormGroup({});
  loading = true;
  uploading = false;
  error: string = '';
  indexRecipeIngredient = 0;
  coverFiles: File[] = [];
  uploadClass: string = '';
  @Observe(RecipeV2State, RecipeV2State.item)
  protected _item!: WritableSignal<RecipeV2FrontInterface | null>;
  _recipe = computed(
    () =>
      this._item() !== null
        ? new RecipeModel(this._item()!)
        : new RecipeModel({})
  );
  private ingredientTranslation: string = '';

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private recipeV2Service: RecipeV2Service,
    private ingredientService: IngredientService,
    private searchService: SearchService,
    private routerService: Router,
    private translatorService: TranslatorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private filterService: FilterService,
    private uploadService: UploadService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl('', [
        Validators.required
      ]),
      type: new UntypedFormControl('', []),
      image: new UntypedFormControl('', []),
      imagePath: new UntypedFormControl('', []),
      source: new UntypedFormControl('', []),
      cookingDuration: new UntypedFormControl('', []),
      preparationDuration: new UntypedFormControl('', []),
      waitingDuration: new UntypedFormControl('', []),
      nbSlices: new UntypedFormControl('', []),
      recipeIngredientForms: new UntypedFormArray([ RecipeComponent.createRecipeIngredient() ], []),
      instructions: new UntypedFormArray([ RecipeComponent.createInstructionRow() ], [])
    });
  }

  get name(): UntypedFormControl {
    return this.form.get('name') as UntypedFormControl;
  }

  get image(): UntypedFormControl {
    return this.form.get('image') as UntypedFormControl;
  }

  get imagePath(): UntypedFormControl {
    return this.form.get('imagePath') as UntypedFormControl;
  }

  get type(): UntypedFormControl {
    return this.form.get('type') as UntypedFormControl;
  }

  get recipeIngredients(): UntypedFormArray {
    return this.form.get('recipeIngredientForms') as UntypedFormArray;
  }

  get instructionRows(): UntypedFormArray {
    return this.form.get('instructions') as UntypedFormArray;
  }

  private static createRecipeIngredient(): UntypedFormGroup {
    return new UntypedFormGroup({
      quantity: new UntypedFormControl('', []),
      unitOrMeasure: new UntypedFormControl('', []),
      ingredientOrRecipe: new UntypedFormControl('', [ Validators.required ]),
      optionCarne: new UntypedFormControl('', []),
      optionVege: new UntypedFormControl('', []),
      optionVegan: new UntypedFormControl('', []),
    }, [ recipeIngredientValidator() ]);
  }

  private static createInstructionRow(): UntypedFormControl {
    return new UntypedFormControl('', [ Validators.required ]);
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (async (data: any) => {
        this.ingredientTranslation = await this.translatorService.instant('Ingredients');
        this.recipeTypes = await this.translatorService.translateLabels(EnumHelper.enumToObject(RecipeTypeLabelEnum));
        this.measureUnits = await this.translatorService.translateLabels(EnumHelper.enumToObject(MeasureUnitLabelEnum));
        this.measureUnits = this.measureUnits.concat(this.recipeService.customMeasures);

        if (data && data['recipe']) {
          await this.loadData(data['recipe']);
        }
        this.loading = false;
      }));
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  async loadData(recipe: RecipeModel) {
    this.recipe = recipe;

    this.form.patchValue(this.recipe);
    this.recipeIngredients.removeAt(0);
    this.instructionRows.removeAt(0);

    for (const recipeIngredient of this.recipe.orderedRecipeIngredients) {
      const i = this.recipe.orderedRecipeIngredients.indexOf(recipeIngredient);
      this.addRecipeIngredient();

      const recipeIngredientForm: RecipeIngredientFormInterface = { ...recipeIngredient };
      recipeIngredientForm.ingredientOrRecipe = recipeIngredient.recipe ? recipeIngredient.recipe : recipeIngredient.ingredient!;
      recipeIngredientForm.unitOrMeasure = recipeIngredient.unit
        ? MeasureUnits.get(recipeIngredient.unit) ? await this.translatorService.instant(MeasureUnits.get(recipeIngredient.unit)!) : recipeIngredient.unit
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
    const recipeIngredient = RecipeIngredientModel.import(recipeIngredientData, this.measureUnits);
    const recipeIngredientString = RelationIngredientModel.relationIngredientToString(recipeIngredient, this.measureUnits);
    return recipeIngredientString !== '' ? recipeIngredientString : `${ this.ingredientTranslation } ${ i + 1 }`;
  }

  async handleSubmit(): Promise<void> {
    const formRecipe = { ...this.form.value, recipeIngredients: [] };
    for (let i = 0; i < this.recipeIngredients.length; i++) {
      formRecipe.recipeIngredients.push(RecipeIngredientModel.import(this.recipeIngredients.at(i).value, this.measureUnits));
    }

    await this.preSubmit(formRecipe);
  }

  async preSubmit(formDocument: RecipeInterface): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.recipe.id) {
        formDocument.id = this.recipe.id;
      }

      const recipe = RecipeModel.import({
        id: this.recipe.id,
        ...this.form.value
      }, this.measureUnits);

      console.log("Measure units", this.measureUnits);
      console.log("Recipe form values", this.form.value);
      console.log("Recipe form entity", recipe);
      console.log("Recipe form converted", await this.recipeV2Service.convert(recipe));
      console.log("Recipe form for store", recipe.toStore());

      void this.submit(recipe);

      /*const ingredient = RecipeModel.import({
        id: this.recipe.id,
        ...this.form.value as IngredientFormInterface
      });*/

      /*const checkExist = !this.recipe.id || slugify(formDocument.name) !== slugify(this.recipe.name);

      if (checkExist) {
        this.recipeService.exist(formDocument.name!).then(async exist => {
          if (exist) {
            return this.name.setErrors({ 'exist': true });
          }
          await this.submit(formDocument);
        });
      } else {
        await this.submit(formDocument);
      }*/
    }
  }

  async submit(recipe: RecipeModel): Promise<void> {
    this.loading = true;

    this.recipeV2Service.add(recipe).then(async recipe => {
      this.loading = false;
      //await this.routerService.navigate([ '/', 'admin', 'recipe', recipe!.slug ]);
    });

    /*if (this.recipe.id) {
      this.loading = true;
      this.recipeService.update(localDocument).then(async recipe => {
        this.loading = false;
        await this.messageService.add({
          severity: 'success',
          detail: await this.translatorService.instant(`Updated recipe`)
        });
        await this.routerService.navigate([ '/', 'admin', 'recipe', recipe!.slug ]);
      });
    } else {
      this.recipeService.add(localDocument).then(async recipe => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: await this.translatorService.instant(`Added recipe`)
        });
        await this.routerService.navigate([ '/', 'admin', 'recipe', recipe!.slug ]);
      });
    }*/
  }

  async remove(): Promise<void> {
    this.confirmationService.confirm({
      key: "recipeConfirm",
      message: await this.translatorService.instant('Are you sure you want to delete it ?'),
      accept: () => {
        this.loading = true;
        this.recipeService.remove(this.recipe).then(async () => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            detail: await this.translatorService.instant(`Deleted recipe`)
          });
          await this.routerService.navigate([ '/', 'admin', 'recipes' ]);
        });
      }
    });
  }

  showNewIngredientModal() {
    this.dialogService.open(DialogIngredientComponent, {
      showHeader: false,
      width: '400px',
      styleClass: 'ingredient'
    });
  }

  searchUnitOrMeasure($event: any) {
    this.unitsOrMeasures = this.measureUnits.filter(measureOrUnit => {
      return this.filterService.filters['contains'](measureOrUnit.key, $event.query);
    });
  }

  getFormGroupRecipeIngredient(i: number): UntypedFormGroup {
    return this.recipeIngredients.at(i) as UntypedFormGroup;
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

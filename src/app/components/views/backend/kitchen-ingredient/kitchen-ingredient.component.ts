import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MeasureUnitEnum, MeasureUnits } from '../../../../enums';
import { KitchenIngredientInterface, RecipeIngredientFormInterface } from '../../../../interfaces';
import { IngredientModel, KitchenIngredientModel, RecipeIngredientModel, RecipeModel } from '../../../../models';
import { KitchenIngredientService, RecipeService, SearchService, TranslatorService } from '../../../../services';
import { EnumHelper, slugify } from '../../../../tools';

@Component({
  selector: 'app-kitchen-ingredient',
  templateUrl: './kitchen-ingredient.component.html',
  styleUrls: [ './kitchen-ingredient.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class KitchenIngredientComponent implements OnInit {
  kitchenIngredient = new KitchenIngredientModel({} as KitchenIngredientInterface);
  measureUnits = EnumHelper.enumToObject(MeasureUnitEnum);
  ingredientsOrRecipes: (IngredientModel | RecipeModel)[] = [];

  form: FormGroup = new FormGroup({});
  loading = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private searchService: SearchService,
    private kitchenIngredientService: KitchenIngredientService,
    private routerService: Router,
    private translatorService: TranslatorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.form = new FormGroup({
      quantity: new FormControl('', []),
      unitOrMeasure: new FormControl('', []),
      ingredientOrRecipe: new FormControl('', [ Validators.required ]),
    });
  }

  ngOnInit() {
    this.route.data.subscribe(
      async (data: any) => {
        this.measureUnits = await this.translatorService.translateLabels(EnumHelper.enumToObject(MeasureUnitEnum));
        this.measureUnits = this.measureUnits.concat(this.recipeService.customMeasures);

        if (data && data['kitchenIngredient']) {
          this.kitchenIngredient = data['kitchenIngredient'];

          const kitchenIngredientForm = { ...this.kitchenIngredient } as RecipeIngredientFormInterface;
          kitchenIngredientForm.ingredientOrRecipe = this.kitchenIngredient.recipe ? this.kitchenIngredient.recipe : this.kitchenIngredient.ingredient!;
          kitchenIngredientForm.unitOrMeasure = this.kitchenIngredient.unit
            ? MeasureUnits[this.kitchenIngredient.unit] ? await this.translatorService.instant(MeasureUnits[this.kitchenIngredient.unit]) : this.kitchenIngredient.unit
            : this.kitchenIngredient.measure;

          this.form.patchValue(kitchenIngredientForm);
        }
        this.loading = false;
      });
  }

  searchIngredientOrRecipe(event: { query: string }): void {
    this.searchService.searchIngredientsOrRecipes(event.query).then(ingredientsOrRecipes => {
      this.ingredientsOrRecipes = ingredientsOrRecipes;
    });
  }

  async handleSubmit(): Promise<void> {
    await this.preSubmit(RecipeIngredientModel.format(this.form.value, this.measureUnits));

  }

  async preSubmit(formDocument: KitchenIngredientInterface): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.kitchenIngredient.id) {
        formDocument.id = this.kitchenIngredient.id;
      }

      formDocument.name = formDocument.ingredient?.name!;
      const checkExist = !this.kitchenIngredient.id || slugify(formDocument.name) !== slugify(this.kitchenIngredient.name!);

      if (checkExist) {
        this.kitchenIngredientService.exist(formDocument.name).then(async exist => {
          if (exist) {
            return this.form.get('ingredientOrRecipe')?.setErrors({ 'exist': true });
          }
          await this.submit(formDocument);
        });
      } else {
        await this.submit(formDocument);
      }
    }
  }

  async submit(localDocument: KitchenIngredientInterface): Promise<void> {
    this.loading = true;
    if (this.kitchenIngredient.id) {
      this.kitchenIngredientService.update(localDocument).then(async ingredient => {
        this.kitchenIngredient = new KitchenIngredientModel(ingredient!);
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: await this.translatorService.instant(`Updated ingredient`)
        });
        await this.routerService.navigate([ '/', 'kitchen-ingredient', this.kitchenIngredient.slug ]);
      });
    } else {
      await this.kitchenIngredientService.add(localDocument).then(async ingredient => {
        this.kitchenIngredient = new KitchenIngredientModel(ingredient!);
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: await this.translatorService.instant(`Added ingredient`),
        });
        await this.routerService.navigate([ '/', 'kitchen-ingredient', this.kitchenIngredient.slug ]);
      });
    }
  }

  async remove(): Promise<void> {
    this.confirmationService.confirm({
      message: await this.translatorService.instant('Are you sure you want to delete it ?'),
      accept: () => {
        this.kitchenIngredientService.remove(this.kitchenIngredient).then(async () => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            detail: await this.translatorService.instant(`Deleted ingredient`)
          });
          await this.routerService.navigate([ '/', 'kitchen-ingredients' ]);
        });
      }
    });
  }
}

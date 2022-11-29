import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MeasureUnitLabelEnum, MeasureUnits} from '@enums';
import {KitchenIngredientInterface} from '@interfaces';
import {IngredientModel, KitchenIngredientModel, RecipeIngredientModel} from '@models';
import {IngredientService, KitchenIngredientService, RecipeService, SearchService, TranslatorService} from '@services';
import {EnumHelper, slugify} from '@tools';
import {ConfirmationService, MessageService} from 'primeng/api';
import {RelationIngredientFormInterface} from "@app/interfaces/relation-ingredient-form.interface";

@Component({
  selector: 'app-kitchen-ingredient',
  templateUrl: './kitchen-ingredient.component.html',
  styleUrls: ['./kitchen-ingredient.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class KitchenIngredientComponent implements OnInit {
  kitchenIngredient = new KitchenIngredientModel({});
  measureUnits = EnumHelper.enumToObject(MeasureUnitLabelEnum);
  ingredients: IngredientModel[] = [];

  form: UntypedFormGroup = new UntypedFormGroup({});
  loading = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private searchService: SearchService,
    private ingredientService: IngredientService,
    private kitchenIngredientService: KitchenIngredientService,
    private routerService: Router,
    private translatorService: TranslatorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.form = new UntypedFormGroup({
      quantity: new UntypedFormControl('', []),
      unitOrMeasure: new UntypedFormControl('', []),
      ingredient: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.route.data.subscribe(
      async (data: any) => {
        this.measureUnits = await this.translatorService.translateLabels(EnumHelper.enumToObject(MeasureUnitLabelEnum));
        this.measureUnits = this.measureUnits.concat(this.recipeService.customMeasures);

        if (data && data['kitchenIngredient']) {
          this.kitchenIngredient = data['kitchenIngredient'];

          const kitchenIngredientForm: RelationIngredientFormInterface = {...this.kitchenIngredient};
          kitchenIngredientForm.ingredient = this.kitchenIngredient.ingredient!;
          kitchenIngredientForm.unitOrMeasure = this.kitchenIngredient.unit
            ? MeasureUnits.get(this.kitchenIngredient.unit) ? await this.translatorService.instant(MeasureUnits.get(this.kitchenIngredient.unit)!) : this.kitchenIngredient.unit
            : this.kitchenIngredient.measure;

          this.form.patchValue(kitchenIngredientForm);
        }
        this.loading = false;
      });
  }

  searchIngredient(event: { query: string }): void {
    this.ingredientService.search(event.query).then(ingredients => {
      this.ingredients = ingredients;
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
            return this.form.get('ingredientOrRecipe')?.setErrors({'exist': true});
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
        await this.routerService.navigate([ '/', 'admin', 'kitchen-ingredient', this.kitchenIngredient.slug ]);
      });
    } else {
      await this.kitchenIngredientService.add(localDocument).then(async ingredient => {
        this.kitchenIngredient = new KitchenIngredientModel(ingredient!);
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: await this.translatorService.instant(`Added ingredient`),
        });
        await this.routerService.navigate([ '/', 'admin', 'kitchen-ingredient', this.kitchenIngredient.slug ]);
      });
    }
  }

  async remove(): Promise<void> {
    this.confirmationService.confirm({
      key: "kitchenIngredientConfirm",
      message: await this.translatorService.instant('Are you sure you want to delete it ?'),
      accept: () => {
        this.kitchenIngredientService.remove(this.kitchenIngredient).then(async () => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            detail: await this.translatorService.instant(`Deleted ingredient`)
          });
          await this.routerService.navigate(['/', 'admin', 'kitchen-ingredients']);
        });
      }
    });
  }
}

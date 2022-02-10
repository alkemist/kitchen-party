import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ConfirmationService, MessageService} from "primeng/api";
import {slugify} from "../../../../tools/slugify";
import {KitchenIngredientInterface, KitchenIngredientModel} from "../../../../models/kitchen-ingredient.model";
import {KitchenIngredientService} from "../../../../services/kitchen.service";
import {EnumHelper} from "../../../../tools/enum.helper";
import {MeasureUnitEnum, MeasureUnits} from "../../../../enums/measure-unit.enum";
import {RecipeService} from "../../../../services/recipe.service";
import {IngredientModel} from "../../../../models/ingredient.model";
import {RecipeModel} from "../../../../models/recipe.model";
import {SearchService} from "../../../../services/search.service";
import {RecipeIngredientFormInterface, RecipeIngredientModel} from "../../../../models/recipe-ingredient.model";

@Component({
  selector: 'app-kitchen-ingredient',
  templateUrl: './kitchen-ingredient.component.html',
  styleUrls: ['./kitchen-ingredient.component.scss'],
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
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.form = new FormGroup({
      quantity: new FormControl('', []),
      unitOrMeasure: new FormControl('', []),
      ingredientOrRecipe: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.route.data.subscribe(
      (data => {
        if (data && data['kitchenIngredient']) {
          this.loadTranslations(() => {
            this.kitchenIngredient = data['kitchenIngredient'];

            const kitchenIngredientForm = {...this.kitchenIngredient} as RecipeIngredientFormInterface;
            kitchenIngredientForm.ingredientOrRecipe = this.kitchenIngredient.recipe ? this.kitchenIngredient.recipe : this.kitchenIngredient.ingredient!;
            kitchenIngredientForm.unitOrMeasure = this.kitchenIngredient.unit
              ? MeasureUnits[this.kitchenIngredient.unit] ? this.translateService.instant(MeasureUnits[this.kitchenIngredient.unit]) : this.kitchenIngredient.unit
              : this.kitchenIngredient.measure;

            this.form.patchValue(kitchenIngredientForm);
          });
        }
        this.loading = false;
      }));
  }

  loadTranslations(callback: () => void) {
    this.translateService.getTranslation('fr').subscribe(() => {
      this.measureUnits = this.measureUnits.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
      this.measureUnits = this.measureUnits.concat(this.recipeService.customMeasures);
      callback();
    });
  }

  searchIngredientOrRecipe(event: { query: string }): void {
    this.searchService.searchIngredients(event.query).then(ingredientsOrRecipes => {
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
      this.kitchenIngredientService.update(localDocument).then(ingredient => {
        this.kitchenIngredient = new KitchenIngredientModel(ingredient!);
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: this.translateService.instant(`Updated ingredient`)
        });
        this.routerService.navigate(['/', 'kitchen-ingredient', this.kitchenIngredient.slug]);
      });
    } else {
      await this.kitchenIngredientService.add(localDocument).then(ingredient => {
        this.kitchenIngredient = new KitchenIngredientModel(ingredient!);
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: this.translateService.instant(`Added ingredient`),
        });
        this.routerService.navigate(['/', 'kitchen-ingredient', this.kitchenIngredient.slug]);
      });
    }
  }

  async remove(): Promise<void> {
    this.confirmationService.confirm({
      message: this.translateService.instant('Are you sure you want to delete it ?'),
      accept: () => {
        this.kitchenIngredientService.remove(this.kitchenIngredient).then(() => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            detail: this.translateService.instant(`Deleted ingredient`)
          });
          this.routerService.navigate(['/', 'kitchen-ingredients']);
        });
      }
    });
  }
}

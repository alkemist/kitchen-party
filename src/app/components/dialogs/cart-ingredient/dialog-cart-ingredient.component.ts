import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MeasureUnitLabelEnum} from '@enums';
import {CartIngredientFormInterface, IngredientInterface} from '@interfaces';
import {IngredientModel} from '@models';
import {IngredientService, RecipeService, TranslatorService} from '@services';
import {EnumHelper} from '@tools';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {recipeIngredientValidator} from "@validators";

@Component({
  selector: 'app-dialog-cart-ingredient',
  templateUrl: './dialog-cart-ingredient.component.html',
  styleUrls: ['./dialog-cart-ingredient.component.scss']
})
export class DialogCartIngredientComponent implements OnInit {
  measureUnits = EnumHelper.enumToObject(MeasureUnitLabelEnum);

  form: UntypedFormGroup = new UntypedFormGroup({});
  loading = false;
  error: string = '';
  ingredients: IngredientModel[] = [];

  cartElement?: CartIngredientFormInterface;

  constructor(
    private ingredientService: IngredientService,
    private recipeService: RecipeService,
    private translatorService: TranslatorService,
    private messageService: MessageService,
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.cartElement = config.data;
    console.info("cartElement", config.data);

    this.form = new FormGroup({
      quantity: new FormControl<number | null>(null),
      unitOrMeasure: new FormControl(),
      ingredientOrOther: new FormControl<IngredientModel | string>('', [Validators.required]),
    }, [recipeIngredientValidator()]);
  }

  get name(): UntypedFormControl {
    return this.form?.get('name') as UntypedFormControl;
  }

  async ngOnInit() {
    this.ingredients = await this.ingredientService.getListOrRefresh();
    console.info("ingredients", this.ingredients);
    this.measureUnits = await this.translatorService.translateLabels(EnumHelper.enumToObject(MeasureUnitLabelEnum));
    this.measureUnits = this.measureUnits.concat(this.recipeService.customMeasures);
  }

  async handleSubmit(): Promise<void> {
    await this.preSubmit(IngredientModel.format(this.form.value));
  }

  async preSubmit(ingredient: IngredientInterface): Promise<void> {
    this.form.markAllAsTouched();

    console.info('submit', this.form.valid, this.form.value);

    if (this.form.valid) {
      /*if (this.ingredient.id) {
        ingredient.id = this.ingredient.id;
      }

      const checkExist = !this.ingredient.id || slugify(ingredient.name) !== slugify(this.ingredient.name);

      if (checkExist) {
        this.ingredientService.exist(ingredient.name!).then(async exist => {
          if (exist) {
            return this.name.setErrors({'exist': true});
          }
          await this.submit(ingredient);
        });
      } else {
        await this.submit(ingredient);
      }*/
    }
  }

  close() {
    this.ref.close();
  }

  async submit(localDocument: IngredientInterface): Promise<void> {
    /*this.loading = true;
    await this.ingredientService.add(localDocument).then(async ingredient => {
      this.ingredient = new IngredientModel(ingredient!);
      this.loading = false;
      this.messageService.add({
        severity: 'success',
        detail: await this.translatorService.instant(`Added ingredient`),
      });
      this.close();
    });*/
  }

  remove() {

  }
}

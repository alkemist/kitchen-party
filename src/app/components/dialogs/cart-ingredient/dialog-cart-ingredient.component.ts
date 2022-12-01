import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, UntypedFormGroup} from '@angular/forms';
import {CartIngredientFormInterface, IngredientInterface} from '@interfaces';
import {IngredientModel} from '@models';
import {IngredientService, RecipeService, TranslatorService} from '@services';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Dropdown} from "primeng/dropdown";
import {cartIngredientValidator} from "@app/validators/cart-ingredient.validator";

@Component({
  selector: 'app-dialog-cart-ingredient',
  templateUrl: './dialog-cart-ingredient.component.html',
  styleUrls: ['./dialog-cart-ingredient.component.scss']
})
export class DialogCartIngredientComponent implements OnInit {
  form: UntypedFormGroup = new UntypedFormGroup({});
  loading = false;
  error: string = '';
  ingredients: IngredientModel[] = [];

  @ViewChild('dropdown') dropdown: Dropdown | undefined;
  selectedIngredient: IngredientModel | string | undefined;

  cartElement?: CartIngredientFormInterface;

  constructor(
    private ingredientService: IngredientService,
    private recipeService: RecipeService,
    private translatorService: TranslatorService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.cartElement = config.data.cartElement as CartIngredientFormInterface;

    this.form = new FormGroup({
      ingredient: new FormControl<IngredientModel | null>(null),
      other: new FormControl<string>(''),
      quantity: new FormControl<string>(''),
    }, [cartIngredientValidator()]);
  }

  get name(): string | undefined {
    if (!this.cartElement) {
      return undefined;
    }

    const item = this.cartElement.ingredient ? this.cartElement.ingredient.name : this.cartElement.other;

    return `${this.cartElement.quantity} ${item}`;
  }

  async ngOnInit() {
    this.ingredients = await this.ingredientService.getListOrRefresh();

    if (this.cartElement) {
      this.form.patchValue({
        ingredient: this.cartElement.ingredient,
        other: this.cartElement.other,
        quantity: this.cartElement.quantity,
      });
    }
  }

  searchIngredient(event: { query: string }): void {
    this.ingredientService.search(event.query).then(ingredients => {
      this.ingredients = ingredients;
    });
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

  async confirmRemove() {
    this.confirmationService.confirm({
        key: "cartIngredientConfirm",
        message: await this.translatorService.instant('Are you sure you want to remove ingredient cart ?'),
        accept: async () => {
          this.remove();
        }
      }
    );
  }

  private remove() {

  }
}

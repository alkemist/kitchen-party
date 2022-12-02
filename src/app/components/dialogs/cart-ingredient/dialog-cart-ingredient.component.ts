import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, UntypedFormGroup} from '@angular/forms';
import {CartIngredientFormInterface, CartIngredientInterface} from '@interfaces';
import {IngredientModel} from '@models';
import {IngredientService, RecipeService, TranslatorService} from '@services';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {cartIngredientValidator} from "@app/validators/cart-ingredient.validator";
import {CartIngredientService} from "@app/services/cart-ingredient.service";
import {slugify} from "@tools";

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

  cartElement?: CartIngredientFormInterface;

  constructor(
    private ingredientService: IngredientService,
    private cartIngredientService: CartIngredientService,
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
    await this.preSubmit();
  }

  async preSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const data = this.form.value;
      const name = data.ingredient?.name ?? data.other;
      const oldName = this.cartElement ? this.cartElement.ingredient?.name ?? this.cartElement?.other : '';

      const checkExist = !this.cartElement?.id || slugify(oldName) !== slugify(name);

      if (checkExist) {
        if (!await this.cartIngredientService.exist(name)) {
          await this.submit(data);
        } else {
          this.messageService.add({
            severity: 'error',
            detail: await this.translatorService.instant(`Element already exist in shopping list.`),
          });
        }
      } else {
        await this.submit(data);
      }
    }
  }

  close() {
    this.ref.close();
  }

  async submit(localDocument: CartIngredientFormInterface): Promise<void> {
    this.loading = true;
    if (this.cartElement?.id) {
      await this.cartIngredientService.update({
        id: this.cartElement.id,
        quantity: localDocument.quantity,
        ingredient: localDocument.ingredient,
        other: localDocument.other,
        checked: this.cartElement.checked,
      })
    } else {
      await this.cartIngredientService.add({
        quantity: localDocument.quantity,
        ingredient: localDocument.ingredient,
        other: localDocument.other,
        checked: false,
      })
    }
    this.loading = false;
    this.ref.close();
  }

  async confirmRemove() {
    this.confirmationService.confirm({
        key: "cartIngredientConfirm",
        message: await this.translatorService.instant('Are you sure you want to remove ingredient cart ?'),
        accept: async () => {
          this.loading = true;
          await this.remove();
          this.loading = false;
          this.close();
        }
      }
    );
  }

  private async remove() {
    if (this.cartElement) {
      await this.cartIngredientService.remove(this.cartElement as CartIngredientInterface);
    }
  }
}

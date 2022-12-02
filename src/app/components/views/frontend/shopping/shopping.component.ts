import {Component, OnInit} from '@angular/core';
import {MeasureUnitLabelEnum} from '@enums';
import {CartIngredientModel, KitchenIngredientModel, RecipeIngredientModel, RelationIngredientModel} from '@models';
import {KitchenIngredientService, TranslatorService} from '@services';
import {Select} from "@ngxs/store";
import {CartIngredientState, KitchenIngredientState} from "@stores";
import {Observable, Subscription} from "rxjs";
import {CartRecipeService} from "@app/services/cart-recipe.service";
import {CartElement, CartIngredientFormInterface, CartIngredientInterface} from "@interfaces";
import {ConfirmationService} from "primeng/api";
import {CartIngredientService} from '@app/services/cart-ingredient.service';
import {DialogService} from "primeng/dynamicdialog";
import {DialogCartIngredientComponent} from "@app/components/dialogs/cart-ingredient/dialog-cart-ingredient.component";

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class ShoppingComponent implements OnInit {
  loading = true;

  cartIngredients: CartIngredientModel[] = [];
  cart: CartElement[] = [];
  cartIndexes: string[] = [];
  kitchenIndexes: string[] = [];
  @Select(KitchenIngredientState.all) private kitchenIngredients$?: Observable<KitchenIngredientModel[]>;
  subscriptions: Subscription[] = [];
  @Select(CartIngredientState.all) private cartIngredients$?: Observable<CartIngredientModel[]>;

  constructor(
    private cartRecipeService: CartRecipeService,
    private cartIngredientService: CartIngredientService,
    private translatorService: TranslatorService,
    private kitchenIngredientService: KitchenIngredientService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
  ) {

  }

  get cartOrderedByChecked(): CartIngredientModel[] {
    return this.cartIngredients.sort((a, b) => {
      const aValue = a.checked ? 1 : -1;
      const bValue = b.checked ? 1 : -1;
      return (aValue > bValue) ? 1 : ((bValue > aValue) ? -1 : RelationIngredientModel.orderTwoRelationIngredients(a, b));
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  async ngOnInit(): Promise<void> {
    await this.kitchenIngredientService.getListOrRefresh().then((kitchenIngredients) => {
      this.kitchenIndexes = kitchenIngredients.map(kitchenIngredient => kitchenIngredient.ingredient?.id!);
    })
    if (this.cartIngredients$) {
      await this.cartIngredientService.getListOrRefresh();
      this.loading = false;
      this.subscriptions.push(
        this.cartIngredients$.subscribe(async (cartIngredients: CartIngredientInterface[]) => {
          this.cartIngredients = await this.cartIngredientService.refreshList(cartIngredients);
        })
      );
    }
  }

  async confirmBuild() {
    this.confirmationService.confirm({
        key: "shoppingConfirm",
        message: await this.translatorService.instant('Are you sure you want to add recipes cart ?'),
        accept: async () => {
          this.loading = true;
          await this.buildShoppingList();
          this.loading = false;
        }
      }
    );
  }

  async confirmRemove() {
    this.confirmationService.confirm({
        key: "shoppingConfirm",
        message: await this.translatorService.instant('Are you sure you want to empty the shopping list ?'),
        accept: async () => {
          this.loading = true;
          await this.removeAll();
          this.loading = false;
        }
      }
    );
  }

  addToShoppingList(recipeIngredient: RecipeIngredientModel, multiplier: number = 1) {
    let cartIndex = this.cartIndexes.indexOf(recipeIngredient.ingredient?.id!);

    if (cartIndex === -1) {
      cartIndex = this.cartIndexes.length;
      this.cartIndexes.push(recipeIngredient.ingredient?.id!);

      const quantities: any = {};
      quantities[''] = 0;
      quantities['undefined'] = 0;
      quantities[MeasureUnitLabelEnum.gram] = 0;
      quantities[MeasureUnitLabelEnum.milliliter] = 0;

      this.cart.push({
        id: recipeIngredient.id,
        ingredient: recipeIngredient.ingredient!,
        inKitchen: false,
        quantities: quantities,
        quantity: ''
      });
    }

    const quantityInformations = recipeIngredient.baseQuantity;

    let quantityType: string = '';
    if (quantityInformations.unit) {
      quantityType = quantityInformations.unit;
    } else if (quantityInformations.measure) {
      quantityType = quantityInformations.measure;
    } else if (quantityInformations.count === 0) {
      quantityType = 'undefined';
    }

    if (typeof this.cart[cartIndex].quantities[quantityType] === 'undefined') {
      this.cart[cartIndex].quantities[quantityType] = 0;
    }

    if (quantityType === 'undefined') {
      this.cart[cartIndex].quantities[quantityType] = 1;
    } else {
      this.cart[cartIndex].quantities[quantityType] += quantityInformations.count * multiplier;
    }
  }

  async finalizeShoppingList() {
    for (const cartElement of this.cart) {
      if (cartElement?.ingredient && this.kitchenIndexes.indexOf(cartElement.ingredient.id!) > -1) {
        cartElement.inKitchen = true;
      }

      const quantities = [];
      for (let quantityType in cartElement.quantities) {
        const count = cartElement.quantities[quantityType];
        if (quantityType === MeasureUnitLabelEnum.gram || quantityType === MeasureUnitLabelEnum.milliliter) {
          quantityType = await this.translatorService.instant(quantityType);
        }

        if (count) {
          if (quantityType == '') {
            quantities.push(`${count}`);
          } else if (quantityType == 'undefined') {
            quantities.push(`∞`);
          } else {
            quantities.push(`${count} ${quantityType}`);
          }
        }
      }
      cartElement.quantity = quantities.join(', ');

      await this.cartIngredientService.add({
        ingredient: cartElement.ingredient,
        other: '',
        checked: cartElement.inKitchen,
        quantity: cartElement.quantity
      });
    }
  }

  edit(index: number, cartElement: CartIngredientModel) {
    this.showIngredientCartModal({
      id: cartElement.id,
      quantity: cartElement.quantity,
      ingredient: cartElement.ingredient,
      other: cartElement.other,
      checked: cartElement.checked,
    });
  }

  async onCheck($event: { checked: boolean }, cartElement: CartIngredientModel) {
    await this.cartIngredientService.update({
      ...cartElement,
      checked: $event.checked
    })
  }

  showIngredientCartModal(cartElement?: CartIngredientFormInterface) {
    this.dialogService.open(DialogCartIngredientComponent, {
      showHeader: false,
      width: '400px',
      styleClass: 'ingredient',
      data: {
        cartElement
      }
    })
  }

  private async removeAll() {
    this.cartIngredients.forEach((cartIngredient) => {
      this.cartIngredientService.remove(cartIngredient);
    })
  }

  private async buildShoppingList() {
    this.cart = [];
    this.cartIndexes = [];

    const cartRecipes = await this.cartRecipeService.getListOrRefresh();

    for (const cartRecipe of cartRecipes) {
      if (cartRecipe.recipe) {
        for (const recipeIngredient of cartRecipe.recipe.recipeIngredients) {
          if (recipeIngredient.recipe) {
            const subRecipe = recipeIngredient.recipe;
            for (const subRecipeIngredient of subRecipe.recipeIngredients) {
              const quantity = recipeIngredient.quantity ?? 1;
              this.addToShoppingList(subRecipeIngredient, quantity * cartRecipe.quantity);
            }
          } else {
            this.addToShoppingList(recipeIngredient, cartRecipe.quantity);
          }
        }
      }
    }

    await this.finalizeShoppingList();
  }
}

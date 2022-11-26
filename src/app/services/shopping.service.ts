import {Injectable} from '@angular/core';
import {MeasureUnitLabelEnum} from '@enums';
import {CartElement} from '@interfaces';
import {RecipeIngredientModel, RecipeModel, RelationIngredientModel} from '@models';
import {KitchenIngredientService, TranslatorService} from '@services';
import {MenuItem} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  selectedRecipes: Map<string, SelectedRecipe>;
  cartItems: MenuItem[] = [];

  cart: CartElement[] = [];
  cartIndexes: string[] = [];
  kitchenIndexes: string[] = [];

  constructor(
    private kitchenService: KitchenIngredientService,
    private translatorService: TranslatorService,
  ) {
    this.selectedRecipes  = new Map<string, SelectedRecipe>();
  }

  addRecipe(recipe: RecipeModel) {
    if (!recipe.id) {
      return;
    }

    if (!this.selectedRecipes.has(recipe.id)) {
      this.selectedRecipes.set(recipe.id, {
        quantity: 0,
        recipe: recipe
      });
    }

    const selectedRecipe = this.selectedRecipes.get(recipe.id);

    if (selectedRecipe) {
      selectedRecipe.quantity++;
      this.selectedRecipes.set(recipe.id, selectedRecipe);
    }

    this.buildCartItems();
  }

  removeRecipe(recipeId: string) {
    const selectedRecipe = this.selectedRecipes.get(recipeId);

    if (selectedRecipe) {
      selectedRecipe.quantity--;

      if (selectedRecipe.quantity <= 0) {
        this.selectedRecipes.delete(recipeId);
      }
    }

    this.buildCartItems();
  }

  removeAllRecipe(recipeId: string) {
    if (this.selectedRecipes.has(recipeId)) {
      this.selectedRecipes.delete(recipeId);
    }

    this.buildCartItems();
  }

  buildCartItems() {
    const cartItems = Array.from(this.selectedRecipes.values())
      .sort((a, b) => a.recipe.name.localeCompare(b.recipe.name));

    this.cartItems = cartItems.map((item) => {
      return {
        label: item.recipe.name,
        badge: item.quantity > 1 ? item.quantity.toString() : '',
        items: [
          {
            label: this.translatorService.translate('Add'),
            icon: 'pi pi-plus',
            recipe: item.recipe,
            command: (event) => {
              this.addRecipe(event.item.recipe);
            }
          },
          {
            label: this.translatorService.translate('Delete one'),
            icon: 'pi pi-minus',
            recipe: item.recipe,
            command: (event) => {
              this.removeRecipe(event.item.recipe.id);
            }
          },
          {
            label: this.translatorService.translate('Delete all'),
            icon: 'pi pi-trash',
            recipe: item.recipe,
            command: (event) => {
              this.removeAllRecipe(event.item.recipe.id);
            }
          }
        ],
        routerLink: `/${item.recipe.slug}`
      };
    });

    if (cartItems.length > 0) {
      this.cartItems.push(
        {
          separator: true
        });
      this.cartItems.push(
        {
          label: 'Shopping list',
          routerLink: `/shopping`
        });
    }
  }

  get cartOrderedByChecked(): CartElement[] {
    return this.cart.sort((a, b) => {
      const aValue = a.inKitchen ? 1 : -1;
      const bValue = b.inKitchen ? 1 : -1;
      return (aValue > bValue) ? 1 : ((bValue > aValue) ? -1 : RelationIngredientModel.orderTwoRelationIngredients(a, b));
    });
  }

  async initIndexes(): Promise<void> {
    const kitchenIngredients = await this.kitchenService.getListOrRefresh();
    this.kitchenIndexes = kitchenIngredients.map(kitchenIngredient => kitchenIngredient.ingredient?.id!);
  }

  initCart(cartRecipes: RecipeModel[]) {
    for (const recipe of cartRecipes) {
      for (const recipeIngredient of recipe.recipeIngredients) {
        if (recipeIngredient.recipe) {
          const subRecipe = recipeIngredient.recipe;
          for (const subRecipeIngredient of subRecipe.recipeIngredients) {
            this.addToCart(subRecipeIngredient, recipeIngredient.quantity ?? 1);
          }
        } else {
          this.addToCart(recipeIngredient);
        }
      }
    }
  }

  private addToCart(recipeIngredient: RecipeIngredientModel, multiplier: number = 1): void {
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

  async mergeCart(): Promise<void> {
    for (const cartElement of this.cart) {
      if (this.kitchenIndexes.indexOf(cartElement.ingredient.id!) > -1) {
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
            quantities.push(`${ count }`);
          } else if (quantityType == 'undefined') {
            quantities.push(`∞`);
          } else {
            quantities.push(`${ count } ${ quantityType }`);
          }
        }
      }
      cartElement.quantity = quantities.join(', ');
    }
  }
}

interface SelectedRecipe {
  quantity: number,
  recipe: RecipeModel
}

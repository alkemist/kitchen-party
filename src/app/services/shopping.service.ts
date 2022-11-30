import { Injectable } from '@angular/core';
import { CartRecipeModel } from '@models';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  cartRecipes: CartRecipeModel[] = [];

  /*selectedRecipes: Map<string, SelectedRecipe>;

  cart: CartElement[] = [];
  cartIndexes: string[] = [];
  kitchenIndexes: string[] = [];

  constructor(
    private kitchenService: KitchenIngredientService,
    private translatorService: TranslatorService,
  ) {
    this.selectedRecipes  = new Map<string, SelectedRecipe>();
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
  }*/
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeasureUnitLabelEnum } from '../../../../enums';
import { IngredientModel, RecipeIngredientModel, RecipeModel } from '../../../../models';
import { KitchenIngredientService, TranslatorService } from '../../../../services';
import { EnumHelper } from '../../../../tools';

interface CartElement {
  inKitchen: boolean,
  ingredient: IngredientModel,
  quantities: { [key: string]: number },
  quantity: string
}

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: [ './shopping.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class ShoppingComponent implements OnInit {
  measureUnits = EnumHelper.enumToObject(MeasureUnitLabelEnum);
  recipes: RecipeModel[] = [];
  cart: CartElement[] = [];
  cartIndexes: string[] = [];
  kitchenIndexes: string[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private translatorService: TranslatorService,
    private kitchenService: KitchenIngredientService
  ) {
  }

  get cartOrderedByChecked(): CartElement[] {
    return this.cart.sort((a, b) => {
      const aValue = a.inKitchen ? 1 : -1;
      const bValue = b.inKitchen ? 1 : -1;
      return (aValue > bValue) ? 1 : ((bValue > aValue) ? -1 : RecipeIngredientModel.orderTwoRecipeIngredients(a, b));
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (async (data: any) => {
        if (data && data['recipes']) {
          this.recipes = data['recipes'];

          const kitchenIngredients = await this.kitchenService.getListOrRefresh();
          this.kitchenIndexes = kitchenIngredients.map(kitchenIngredient => kitchenIngredient.ingredient?.id!);

          this.initCart();

          RecipeIngredientModel.orderRecipeIngredients(this.cart);

          await this.mergeCart();

          this.loading = false;
        }
      }));
  }

  loadData() {

  }

  initCart() {
    for (const recipe of this.recipes) {
      for (const recipeIngredient of recipe.recipeIngredients) {
        if (recipeIngredient.recipe) {
          const subRecipe = recipeIngredient.recipe;
          for (const subRecipeIngredient of subRecipe.recipeIngredients) {
            this.addToCart(subRecipeIngredient);
          }
        } else {
          this.addToCart(recipeIngredient);
        }
      }
    }
  }

  addToCart(recipeIngredient: RecipeIngredientModel) {
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
      this.cart[cartIndex].quantities[quantityType] += quantityInformations.count;
    }
  }

  async mergeCart() {
    for (const cartElement of this.cart) {
      if (this.kitchenIndexes.indexOf(cartElement.ingredient?.id!) > -1) {
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

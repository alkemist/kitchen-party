import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router, RoutesRecognized } from '@angular/router';
import {
  baseMenuItems,
  CustomMenuItemCommandEvent,
  loggedMenuItems,
  logoutMenuItem,
  notLoggedMenuItems
} from '@consts';
import { DietTypeLabelEnum, RecipeTypeLabelEnum, SweetSaltyLabelEnum } from '@enums';
import { CartRecipeInterface, IngredientInterface } from '@interfaces';
import { CartRecipeModel, IngredientModel } from '@models';
import { Select } from '@ngxs/store';
import { FilteringService, IngredientService, TranslatorService, UserService } from '@services';
import { CartRecipeState, IngredientState } from '@stores';
import { EnumHelper } from '@tools';
import { default as NoSleep } from 'nosleep.js';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { CartRecipeService } from "@app/services/cart-recipe.service";
import { DataStoreUserInterface } from '@alkemist/ngx-data-store';


export interface ToolbarFilters {
  diet: DietTypeLabelEnum | string,
  type: string,
  name: string,
  sweetOrSalty: string,
  nbSlices: number | null,
  isSeason: boolean,
  ingredients: string[]
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedUser?: DataStoreUserInterface;
  menuItems: MenuItem[] = [];
  cartItems: MenuItem[] = [];
  title: string = '';

  showFilters = false;
  showShopping = false;
  showAppName = false;
  @HostBinding('class.hideHeader') hideHeader = false;

  recipeTypes = EnumHelper.enumToObject(RecipeTypeLabelEnum);
  dietTypes = EnumHelper.enumToObject(DietTypeLabelEnum);
  sweetOrSalty = EnumHelper.enumToObject(SweetSaltyLabelEnum);
  loading = true;
  sidebarShowed = false;
  noSleep = new NoSleep();
  subscriptions: Subscription[] = [];

  ingredients: IngredientModel[] = [];
  cartRecipesSize = 0;
  cartRecipes: CartRecipeModel[] = [];
  @Select(IngredientState.all) private ingredients$?: Observable<IngredientInterface[]>;
  @Select(CartRecipeState.all) private cartRecipes$?: Observable<CartRecipeInterface[]>;

  constructor(
    private userService: UserService,
    private router: Router,
    private translatorService: TranslatorService,
    private ingredientService: IngredientService,
    private cartRecipeService: CartRecipeService,
    private filteringService: FilteringService,
    private confirmationService: ConfirmationService,
  ) {
    if (this.ingredients$) {
      this.subscriptions.push(
        this.ingredients$.subscribe(async (ingredients: IngredientInterface[]) => {
          this.ingredients = this.ingredientService.refreshList(ingredients);
        })
      );
    }

    this.filteringService.setFilters(new UntypedFormGroup({
      diet: new UntypedFormControl(null, []),
      type: new UntypedFormControl(null, []),
      name: new UntypedFormControl(null, []),
      nbSlices: new UntypedFormControl(null, []),
      sweetOrSalty: new UntypedFormControl(null, []),
      isSeason: new UntypedFormControl(false, []),
      ingredients: new UntypedFormControl([], []),
    }));
  }

  get form() {
    return this.filteringService.getFilters();
  }

  get filterSummary() {
    return this.filteringService.getFilterSummary();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  async ngOnInit(): Promise<void> {
    this.router.events.subscribe((route: any) => {
      if (route instanceof RoutesRecognized) {
        let routeData = route.state.root.firstChild?.data as Record<string, any>;

        // Submodule route data
        if (Object.keys(routeData).length === 0) {
          routeData = route.state.root.children[0].children[0].data;
        }

        if (routeData && typeof routeData !== 'undefined') {
          this.initVariables(routeData);
        }
      }
    });

    this.dietTypes = await this.translatorService.translateLabels(this.dietTypes);
    this.recipeTypes = await this.translatorService.translateLabels(this.recipeTypes);
    this.sweetOrSalty = await this.translatorService.translateLabels(this.sweetOrSalty);

    this.ingredientService.getListOrRefresh().then((ingredients) => {
      this.ingredients = ingredients;
    })

    if (this.cartRecipes$) {
      await this.cartRecipeService.getListOrRefresh();
      this.subscriptions.push(
        this.cartRecipes$
          .subscribe(async (cartRecipes: CartRecipeInterface[]) => {
            const cartRecipesModel = await this.cartRecipeService.refreshList(cartRecipes);
            this.buildCartItems(cartRecipesModel);
          })
      );
    }

    this.loggedUser = await this.userService.getLoggedUser();

    let menuItems: MenuItem[] = baseMenuItems;
    if (this.loggedUser) {
      menuItems = menuItems.concat(loggedMenuItems);
      menuItems.push({
        ...logoutMenuItem, command: () => {
          this.userService.logout().then(() => {
            this.router.navigate([ '/' ]);
          });
        }
      });
    } else {
      menuItems = menuItems.concat(notLoggedMenuItems);
    }
    this.menuItems = await this.translateMenu(menuItems);
    this.loading = false;
  }

  async translateMenu(menuItems: MenuItem[]): Promise<MenuItem[]> {
    const menuItemsTranslated = [];
    for (const item of menuItems) {
      const itemTranslated = { ...item };
      if (item.label) {
        itemTranslated.label = await this.translatorService.instant(item.label);
      }
      if (item.items) {
        itemTranslated.items = [];
        for (const subItem of item.items) {
          const subItemTranslated = { ...subItem };
          if (subItem.label) {
            subItemTranslated.label = await this.translatorService.instant(subItem.label);
          }
          itemTranslated.items?.push(subItemTranslated);
        }
      }
      menuItemsTranslated.push(itemTranslated);
    }
    return menuItemsTranslated;
  }

  resetFilters() {
    this.sidebarShowed = false;
    this.form.patchValue({
      name: '',
      diet: '',
      type: '',
      sweetOrSalty: '',
      nbSlices: null,
      isSeason: false,
      ingredients: []
    } as ToolbarFilters);
  }

  buildCartItems(cartRecipes: CartRecipeModel[]) {
    let totalSlice = 0;
    this.cartRecipesSize = 0;

    const cartItems: MenuItem[] = cartRecipes.map((item) => {
      if (item.recipe?.nbSlices) {
        totalSlice += item.recipe.nbSlices * item.quantity;
      }
      this.cartRecipesSize += item.quantity;

      return {
        label: item.recipe?.name,
        badge: item.quantity > 1 ? item.quantity.toString() : '',
        items: [
          {
            label: this.translatorService.translate('Recipe'),
            icon: 'pi pi-eye',
            styleClass: 'subItem',
            cartItem: item,
            command: async (event: CustomMenuItemCommandEvent) => {
              await this.router.navigate([ '/', event.item.cartItem.recipe!.slug ])
            }
          },
          {
            label: this.translatorService.translate('Add one'),
            icon: 'pi pi-plus',
            styleClass: 'subItem',
            cartItem: item,
            command: async (event: CustomMenuItemCommandEvent) => {
              await this.cartRecipeService.updateQuantity(event.item.cartItem, 1);
            }
          },
          {
            label: this.translatorService.translate('Delete one'),
            icon: 'pi pi-minus',
            styleClass: 'subItem',
            cartItem: item,
            command: async (event: CustomMenuItemCommandEvent) => {
              await this.cartRecipeService.updateQuantity(event.item.cartItem, -1);
            }
          },
          {
            label: this.translatorService.translate('Delete all'),
            icon: 'pi pi-trash',
            styleClass: 'subItem',
            cartItem: item,
            command: async (event: CustomMenuItemCommandEvent) => {
              this.confirmationService.confirm({
                  key: "headerConfirm",
                  message: `${ await this.translatorService.instant('Are you sure you want to delete it ?') }
                  ${ item.recipe?.name }`,
                  accept: async () => {
                    await this.cartRecipeService.remove(event.item.cartItem);
                  }
                }
              );
            }
          }
        ],
      };
    });

    if (cartItems.length > 0) {
      cartItems.push(
        {
          separator: true
        });

      cartItems.push({
        label: this.translatorService.translate('Empty the cart'),
        icon: 'pi pi-trash',
        command: async () => {
          this.confirmationService.confirm({
              key: "headerConfirm",
              message: await this.translatorService.instant('Are you sure you want to empty the cart ?'),
              accept: async () => {
                await this.cartRecipeService.removeAll();
              }
            }
          );
        }
      });
    }

    cartItems.push(
      {
        label: this.translatorService.translate('Shopping list'),
        icon: 'pi pi-shopping-cart',
        badge: totalSlice > 0 ? `${ totalSlice } ${ this.translatorService.translate('Slices') }` : '',
        routerLink: `/shopping`
      }
    );

    this.cartItems = cartItems;
  }

  private initVariables(routeData: any) {
    if (typeof routeData['title'] === 'string') {
      this.title = routeData['title'];
    } else {
      this.title = '';
    }

    if (typeof routeData['showFilters'] === 'boolean') {
      this.showFilters = routeData['showFilters'];
    } else {
      this.showFilters = false;
    }

    if (typeof routeData['showShopping'] === 'boolean') {
      this.showShopping = routeData['showShopping'];
    } else {
      this.showShopping = false;
    }

    if (typeof routeData['hideHeader'] === 'boolean') {
      this.hideHeader = routeData['hideHeader'];
    } else {
      this.hideHeader = false;
    }

    if (typeof routeData['showAppName'] === 'boolean') {
      this.showAppName = routeData['showAppName'];
    } else {
      this.showAppName = false;
    }

    if (typeof routeData['enableNoSleep'] === 'boolean' && routeData['enableNoSleep']) {
      if (!this.noSleep.isEnabled) {
        this.noSleep.enable().then();
      }
    } else {
      if (this.noSleep.isEnabled) {
        this.noSleep.disable();
      }
    }
  }
}

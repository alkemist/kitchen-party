import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RoutesRecognized } from '@angular/router';
import { baseMenuItems, loggedMenuItems, logoutMenuItem, notLoggedMenuItems } from '@consts';
import { DietTypeLabelEnum, RecipeTypeLabelEnum, SweetSaltyLabelEnum } from '@enums';
import { UserInterface } from '@interfaces';
import { IngredientModel } from '@models';
import { Select } from '@ngxs/store';
import { FilteringService, IngredientService, ShoppingService, TranslatorService, UserService } from '@services';
import { IngredientState } from '@stores';
import { EnumHelper } from '@tools';
import { default as NoSleep } from 'nosleep.js';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';


export interface ToolbarFilters {
  diet: DietTypeLabelEnum | string,
  type: string,
  name: string,
  sweetOrSalty: string,
  isSeason: boolean,
  ingredients: string[]
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {
  ingredients: IngredientModel[] = [];
  loggedUser?: UserInterface;
  menuItems: MenuItem[] = [];
  title: string = '';

  showFilters = false;
  showAppName = false;
  @HostBinding('class.hideHeader') hideHeader = false;

  recipeTypes = EnumHelper.enumToObject(RecipeTypeLabelEnum);
  dietTypes = EnumHelper.enumToObject(DietTypeLabelEnum);
  sweetOrSalty = EnumHelper.enumToObject(SweetSaltyLabelEnum);
  loading = true;
  sidebarShowed = false;
  noSleep = new NoSleep();
  @Select(IngredientState.all) private ingredients$?: Observable<IngredientModel[]>;

  constructor(
    private userService: UserService,
    private router: Router,
    private translatorService: TranslatorService,
    private ingredientService: IngredientService,
    private filteringService: FilteringService,
    private shoppingService: ShoppingService,
  ) {
    this.ingredients$?.subscribe((ingredients: IngredientModel[]) => {
      this.ingredients = ingredients;
    });
    this.filteringService.setFilters(new FormGroup({
      diet: new FormControl(null, []),
      type: new FormControl(null, []),
      name: new FormControl(null, []),
      sweetOrSalty: new FormControl(null, []),
      isSeason: new FormControl(false, []),
      ingredients: new FormControl([], []),
    }));
  }

  get form() {
    return this.filteringService.getFilters();
  }

  get selectedRecipes() {
    return this.shoppingService.selectedRecipes;
  }

  async ngOnInit(): Promise<void> {
    this.router.events.subscribe((route: any) => {
      if (route instanceof RoutesRecognized) {
        const routeData = route.state.root.firstChild?.data;
        if (routeData && typeof routeData !== 'undefined') {
          this.initVariables(routeData);
        }
      }
    });

    this.dietTypes = await this.translatorService.translateLabels(this.dietTypes);
    this.recipeTypes = await this.translatorService.translateLabels(this.recipeTypes);
    this.sweetOrSalty = await this.translatorService.translateLabels(this.sweetOrSalty);

    await this.userService.getLoggedUser(async (loggedUser) => {
      this.loading = false;
      this.loggedUser = loggedUser;

      let menuItems: MenuItem[] = baseMenuItems;
      if (loggedUser) {
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
    });

    this.ingredientService.getListOrRefresh().then(ingredients => {
      this.ingredients = ingredients;
      this.loading = false;
    });
  }

  async translateMenu(menuItems: MenuItem[]): Promise<MenuItem[]> {
    const menuItemsTranslated = [];
    for (const item of menuItems) {
      const itemTranslated = {...item};
      if (item.label) {
        itemTranslated.label = await this.translatorService.instant(item.label);
      }
      if (item.items) {
        itemTranslated.items = [];
        for (const subItem of item.items) {
          const subItemTranslated = {...subItem};
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
      isSeason: false,
      ingredients: []
    } as ToolbarFilters);
  }

  gotoShopping() {
    this.sidebarShowed = false;
    this.router.navigate([ '/', 'shopping', this.selectedRecipes.join(',') ]).then();
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

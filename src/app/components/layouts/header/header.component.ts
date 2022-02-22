import { Component, HostBinding, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RoutesRecognized } from '@angular/router';
import { Select } from '@ngxs/store';
import { default as NoSleep } from 'nosleep.js';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { DietTypeEnum } from '../../../enums/diet-type.enum';
import { RecipeTypeEnum } from '../../../enums/recipe-type.enum';
import { SweetSaltyEnum } from '../../../enums/sweet-salty.enum';
import { UserInterface } from '../../../interfaces/user.interface';
import { IngredientModel } from '../../../models/ingredient.model';
import { FilterService } from '../../../services/filter.service';
import { IngredientService } from '../../../services/ingredient.service';
import { ShoppingService } from '../../../services/shopping.service';
import { TranslatorService } from '../../../services/translator.service';
import { UserService } from '../../../services/user.service';
import { IngredientState } from '../../../stores/ingredient.state';
import { EnumHelper } from '../../../tools/enum.helper';

export interface ToolbarFilters {
  diet: string,
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
  menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/'
    },
    {
      label: 'Calendar',
      icon: 'pi pi-calendar',
      routerLink: '/calendar'
    },
    {
      label: 'About',
      icon: 'pi pi-question',
      routerLink: '/about'
    },
    {
      separator: true
    },
  ];
  title: string = '';

  showFilters = false;
  showAppName = false;
  @HostBinding('class.hideHeader') hideHeader = false;

  recipeTypes = EnumHelper.enumToObject(RecipeTypeEnum);
  dietTypes = EnumHelper.enumToObject(DietTypeEnum);
  sweetOrSalty = EnumHelper.enumToObject(SweetSaltyEnum);
  loading = true;
  sidebarShowed = false;
  noSleep = new NoSleep();
  @Select(IngredientState.all) private ingredients$?: Observable<IngredientModel[]>;

  constructor(
    private userService: UserService,
    private router: Router,
    private translatorService: TranslatorService,
    private ingredientService: IngredientService,
    private filterService: FilterService,
    private shoppingService: ShoppingService,
  ) {
    this.ingredients$?.subscribe((ingredients: IngredientModel[]) => {
      this.ingredients = ingredients;
    });
    this.router.events.subscribe((data: any) => {
      if (data instanceof RoutesRecognized) {
        const routeData = data.state.root.firstChild?.data;
        if (routeData && typeof routeData !== 'undefined') {
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
              this.noSleep.enable();
            }
          } else {
            if (this.noSleep.isEnabled) {
              this.noSleep.disable();
            }
          }

        }
      }
    });
    this.filterService.filters = new FormGroup({
      diet: new FormControl(null, []),
      type: new FormControl(null, []),
      name: new FormControl(null, []),
      sweetOrSalty: new FormControl(null, []),
      isSeason: new FormControl(false, []),
      ingredients: new FormControl([], []),
    });
  }

  get form() {
    return this.filterService.filters;
  }

  get selectedRecipes() {
    return this.shoppingService.selectedRecipes;
  }

  async ngOnInit(): Promise<void> {
    this.dietTypes = await this.translatorService.translateLabels(this.dietTypes);
    this.recipeTypes = await this.translatorService.translateLabels(this.recipeTypes);
    this.sweetOrSalty = await this.translatorService.translateLabels(this.sweetOrSalty);

    await this.userService.getLoggedUser(async (loggedUser) => {
      this.loading = false;
      this.loggedUser = loggedUser;

      if (loggedUser) {
        this.menuItems = this.menuItems.concat([ {
          label: 'Ingredients',
          items: [
            {
              label: 'List',
              icon: 'pi pi-list',
              routerLink: '/ingredients',
            },
            {
              label: 'New',
              icon: 'pi pi-plus',
              routerLink: '/ingredient'
            },
          ]
        },
          {
            label: 'Recipes',
            items: [
              {
                label: 'List',
                icon: 'pi pi-list',
                routerLink: '/recipes',
              },
              {
                label: 'New',
                icon: 'pi pi-plus',
                routerLink: '/recipe'
              },
            ]
          },
          {
            label: 'Kitchen',
            items: [
              {
                label: 'List',
                icon: 'pi pi-list',
                routerLink: '/kitchen-ingredients',
              },
              {
                label: 'New',
                icon: 'pi pi-plus',
                routerLink: '/kitchen-ingredient'
              },
            ]
          },
          {
            separator: true
          },
          {
            label: 'Sign out',
            icon: 'pi pi-sign-out',
            command: () => {
              this.userService.logout().then(() => {
                this.router.navigate([ '/' ]);
              });
            }
          } ]);
      } else {
        this.menuItems = this.menuItems.concat([
          {
            separator: true
          },
          {
            label: 'Log in',
            icon: 'pi pi-user',
            routerLink: '/login',
          }
        ]);
      }


      for (const item of this.menuItems) {
        if (item.label) {
          item.label = await this.translatorService.instant(item.label);
        }
        if (item.items) {
          for (const subItem of item.items) {
            if (subItem.label) {
              subItem.label = await this.translatorService.instant(subItem.label);
            }
          }
        }
      }

      this.ingredientService.getListOrRefresh().then(ingredients => {
        this.ingredients = ingredients;
        this.loading = false;
      });
    });
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
    this.router.navigate([ '/', 'shopping', this.selectedRecipes.join(',') ]);
  }
}

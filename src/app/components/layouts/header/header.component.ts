import {Component, HostBinding, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router, RoutesRecognized} from '@angular/router';
import {Select} from '@ngxs/store';
import NoSleep from 'nosleep.js';
import {MenuItem} from 'primeng/api';
import {Observable} from 'rxjs';
import {DietTypeEnum} from '../../../enums/diet-type.enum';
import {RecipeTypeEnum} from '../../../enums/recipe-type.enum';
import {SweetSaltyEnum} from '../../../enums/sweet-salty.enum';
import {IngredientModel} from '../../../models/ingredient.model';
import {FilterService} from '../../../services/filter.service';
import {IngredientService} from '../../../services/ingredient.service';
import {ShoppingService} from '../../../services/shopping.service';
import {TranslatorService} from '../../../services/translator.service';
import {UserService} from '../../../services/user.service';
import {IngredientState} from '../../../store/ingredient.state';
import {UserInterface} from '../../../store/user.state';
import {EnumHelper} from '../../../tools/enum.helper';

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
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  ingredients: IngredientModel[] = [];
  loggedUser?: UserInterface;
  menuItems: MenuItem[] = [
    {
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
      label: 'User',
      items: [
        {
          label: 'Home',
          icon: 'pi pi-home',
          routerLink: '/'
        },
        {
          label: 'Sign out',
          icon: 'pi pi-sign-out',
          command: () => {
            this.userService.logout().then(() => {
              this.router.navigate(['/']);
            });
          }
        }]
    }
  ];
  title: string = '';
  showFilters = false;
  @HostBinding('class.hideHeader') hideHeader = false;
  recipeTypes = EnumHelper.enumToObject(RecipeTypeEnum);
  dietTypes = EnumHelper.enumToObject(DietTypeEnum);
  sweetOrSalty = EnumHelper.enumToObject(SweetSaltyEnum);
  loading = true;
  menuShowed = false;
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
    this.ingredients$?.subscribe(ingredients => {
      this.ingredients = ingredients;
    });
    this.router.events.subscribe((data) => {
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

    for (const item of this.menuItems) {
      item.label = await this.translatorService.instant(item.label!);
      if (item.items) {
        for (const subItem of item.items) {
          subItem.label = await this.translatorService.instant(subItem.label!);
        }
      }
    }

    await this.userService.getLoggedUser((loggedUser) => {
      this.loading = false;
      this.loggedUser = loggedUser;
      this.ingredientService.getListOrRefresh().then(ingredients => {
        this.ingredients = ingredients;
        this.loading = false;
      });
    });
  }

  resetFilters() {
    this.menuShowed = false;
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
    this.menuShowed = false;
    this.router.navigate(['/', 'shopping', this.selectedRecipes.join(',')]);
  }
}

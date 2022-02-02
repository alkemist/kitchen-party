import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router, RoutesRecognized} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {User} from 'firebase/auth';
import {MenuItem} from 'primeng/api';
import {DietTypeEnum} from '../../../enums/diet-type.enum';
import {RecipeTypeEnum} from '../../../enums/recipe-type.enum';
import {IngredientModel} from '../../../models/ingredient.model';
import {IngredientService} from '../../../services/ingredient.service';
import {SearchService} from '../../../services/search.service';
import {UserService} from '../../../services/user.service';
import {EnumHelper} from '../../../tools/enum.helper';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loggedUser?: User;
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
      label: 'User',
      items: [{
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
  showFilter = false;
  ingredients: IngredientModel[] = [];
  recipeTypes = EnumHelper.enumToObject(RecipeTypeEnum);
  dietTypes = EnumHelper.enumToObject(DietTypeEnum);
  loading = true;
  menuShowed = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private translateService: TranslateService,
    private ingredientService: IngredientService,
    private searchService: SearchService,
  ) {
    this.translateService.getTranslation('fr').subscribe(() => {
      this.menuItems.forEach(item => {
        item.label = this.translateService.instant(item.label!);
        item.items?.forEach(item => {
          item.label = this.translateService.instant(item.label!);
        });
      });
      this.dietTypes = this.dietTypes.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
      this.recipeTypes = this.recipeTypes.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
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
          if (typeof routeData['showFilter'] === 'boolean') {
            this.showFilter = routeData['showFilter'];
          } else {
            this.showFilter = true;
          }
        }
      }
    });
    this.searchService.filters = new FormGroup({
      diet: new FormControl(null, []),
      type: new FormControl(null, []),
      name: new FormControl(null, []),
      ingredients: new FormControl([], [])
    });
  }

  get form() {
    return this.searchService.filters;
  }

  async ngOnInit(): Promise<void> {
    await this.userService.getLoggedUser((loggedUser) => {
      this.loggedUser = loggedUser;
      this.ingredientService.getListOrRefresh().then(ingredients => {
        this.ingredients = ingredients;
        this.loading = false;
      });
    });
  }

  resetFilters() {
    this.form.patchValue({
      diet: null,
      type: null,
      name: null,
      ingredients: []
    });
  }
}

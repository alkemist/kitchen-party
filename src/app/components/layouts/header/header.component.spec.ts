import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterEvent, RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { MockModule, MockProvider } from 'ng-mocks';
import { default as NoSleep } from 'nosleep.js';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SidebarModule } from 'primeng/sidebar';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { Subject } from 'rxjs';
import { baseMenuItems, loggedMenuItems, logoutMenuItem, notLoggedMenuItems } from '../../../consts/menu-items.const';
import { IngredientModel, UserInterface } from '../../../models';
import { TranslatingModule } from '../../../modules/translating.module';
import {
  FilteringService,
  IngredientService,
  ShoppingService,
  TranslatorService,
  UserService
} from '../../../services';
import { IngredientState } from '../../../stores/ingredient.state';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userServiceMock: UserService;
  let shoppingServiceMock: ShoppingService;
  let ingredientServiceMock: IngredientService;
  let translatorServiceMock: TranslatorService;
  let filteringService: FilteringService;
  let filtersForm: FormGroup;
  let routerEventsSubject = new Subject<RouterEvent>();

  const routerMock = {
    navigate: jest.fn().mockName('navigate').mockResolvedValue(true),
    events: routerEventsSubject.asObservable(),
  };

  const noSleepMock = {
    enable: jest.fn(),
    disable: jest.fn(),
    isEnabled: false,
    _addSourceToVideo: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MockModule(TranslatingModule),
        MockModule(ToolbarModule),
        MockModule(ButtonModule),
        MockModule(DropdownModule),
        MockModule(ToggleButtonModule),
        MockModule(SidebarModule),
        MockModule(TieredMenuModule),
        MockModule(MultiSelectModule),
        NgxsModule.forRoot([ IngredientState ], {
          developmentMode: true
        })
      ],
      declarations: [ HeaderComponent ],
      providers:
        [
          MockProvider(UserService),
          MockProvider(TranslatorService),
          MockProvider(IngredientService),
          MockProvider(FilteringService),
          MockProvider(ShoppingService),
          MockProvider(Router, routerMock)
        ],
    })
      .compileComponents();

    userServiceMock = TestBed.inject(UserService);
    shoppingServiceMock = TestBed.inject(ShoppingService);
    ingredientServiceMock = TestBed.inject(IngredientService);
    translatorServiceMock = TestBed.inject(TranslatorService);
    filteringService = TestBed.inject(FilteringService);
    shoppingServiceMock.selectedRecipes = [];
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.noSleep = noSleepMock as unknown as NoSleep;

    filtersForm = new FormGroup({
      diet: new FormControl(null, []),
      type: new FormControl(null, []),
      name: new FormControl(null, []),
      sweetOrSalty: new FormControl(null, []),
      isSeason: new FormControl(false, []),
      ingredients: new FormControl([], []),
    });
    jest.spyOn(filteringService, 'getFilters').mockReturnValue(filtersForm);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    const ingredients = [ 'ingredient1', 'ingredient2' ] as unknown as IngredientModel[];
    let translateMenuSpy: jest.SpyInstance;
    let noSleepEnableSpy: jest.SpyInstance;
    let noSleepDisableSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.spyOn(ingredientServiceMock, 'getListOrRefresh').mockReturnValue(Promise.resolve(ingredients));
      translateMenuSpy = jest.spyOn(component, 'translateMenu');
      noSleepEnableSpy = jest.spyOn(component.noSleep, 'enable').mockImplementation();
      noSleepDisableSpy = jest.spyOn(component.noSleep, 'disable').mockImplementation();
    });

    it('should init variables', async () => {
      await component.ngOnInit();
      let title;
      let state;

      title = 'test';
      state = {
        root: {
          firstChild: {
            data: {
              title: title,
              showFilters: true,
              hideHeader: true,
              showAppName: true,
              enableNoSleep: true,
            }
          }
        }
      } as unknown as RouterStateSnapshot;

      noSleepMock.isEnabled = false;
      routerEventsSubject.next(new RoutesRecognized(1, '/', '', state));
      expect(component.title).toBe(title);
      expect(component.showFilters).toBe(true);
      expect(component.hideHeader).toBe(true);
      expect(component.showAppName).toBe(true);
      expect(noSleepDisableSpy).not.toBeCalled();
      expect(noSleepEnableSpy).toBeCalled();

      noSleepDisableSpy.mockReset();
      noSleepEnableSpy.mockReset();
      noSleepMock.isEnabled = true;
      routerEventsSubject.next(new RoutesRecognized(1, '/', '', state));
      expect(noSleepDisableSpy).not.toBeCalled();
      expect(noSleepEnableSpy).not.toBeCalled();

      noSleepDisableSpy.mockReset();
      noSleepEnableSpy.mockReset();
      title = '';
      state = { root: { firstChild: { data: {} } } } as unknown as RouterStateSnapshot;
      noSleepMock.isEnabled = false;
      routerEventsSubject.next(new RoutesRecognized(1, '/', '', state));
      expect(component.title).toBe(title);
      expect(component.showFilters).toBe(false);
      expect(component.hideHeader).toBe(false);
      expect(component.showAppName).toBe(false);
      expect(noSleepDisableSpy).not.toBeCalled();
      expect(noSleepEnableSpy).not.toBeCalled();

      noSleepDisableSpy.mockReset();
      noSleepEnableSpy.mockReset();
      noSleepMock.isEnabled = true;
      routerEventsSubject.next(new RoutesRecognized(1, '/', '', state));
      expect(noSleepDisableSpy).toBeCalled();
      expect(noSleepEnableSpy).not.toBeCalled();
    });

    it('should build not logged menu', async () => {
      jest.spyOn(userServiceMock, 'getLoggedUser').mockImplementation((event?: (user?: UserInterface) => void): Promise<UserInterface | undefined> => {
        const user = undefined;
        event!(user);
        return Promise.resolve(user);
      });
      translateMenuSpy.mockImplementation((menuItems: MenuItem[]) => {
        return menuItems;
      });

      expect(component.loading).toBe(true);

      await component.ngOnInit();

      expect(translateMenuSpy).toHaveBeenCalledWith([ ...baseMenuItems, ...notLoggedMenuItems ]);
      expect(component.menuItems).toEqual([ ...baseMenuItems, ...notLoggedMenuItems ]);
      expect(component.ingredients).toEqual(ingredients as unknown as IngredientModel[]);
      expect(component.loading).toBe(false);
    });

    describe('logged', () => {
      beforeEach(() => {
        jest.spyOn(userServiceMock, 'getLoggedUser').mockImplementation((event?: (user?: UserInterface) => void): Promise<UserInterface | undefined> => {
          const user = {} as UserInterface;
          event!(user);
          return Promise.resolve(user);
        });
      });

      it('should build logged menu', async () => {
        translateMenuSpy.mockImplementation((menuItems: MenuItem[]) => {
          delete menuItems[menuItems.length - 1].command;
          return menuItems;
        });

        expect(component.loading).toBe(true);

        await component.ngOnInit();

        expect(component.menuItems).toEqual(
          expect.arrayContaining([ ...baseMenuItems, ...loggedMenuItems, logoutMenuItem ])
        );
        expect(component.ingredients).toEqual(ingredients as unknown as IngredientModel[]);
        expect(component.loading).toBe(false);
      });

      it('should log out', async () => {
        translateMenuSpy.mockImplementation((menuItems: MenuItem[]) => {
          return menuItems;
        });
        jest.spyOn(userServiceMock, 'logout').mockResolvedValue();
        const logoutSpy = jest.spyOn(userServiceMock, 'logout');

        await component.ngOnInit();

        const logoutMenuItem = component.menuItems[component.menuItems.length - 1] as MenuItem;

        logoutMenuItem.command!();

        expect(logoutSpy).toBeCalled();
      });
    });
  });


  it('should reset filters', () => {
    component.form.patchValue({
      name: 'mock',
      diet: 'mock',
      type: 'mock',
      sweetOrSalty: 'mock',
      isSeason: true,
      ingredients: [ 'mock' ]
    });
    component.resetFilters();

    expect(component.form.value).toEqual({
      name: '',
      diet: '',
      type: '',
      sweetOrSalty: '',
      isSeason: false,
      ingredients: []
    });
  });

  it('should translate menu', async () => {
    const translatedLabel = 'test translated';
    jest.spyOn(translatorServiceMock, 'instant').mockResolvedValue(translatedLabel);
    expect(await component.translateMenu([ {
      label: 'test',
      items: [ { label: 'test' } ]
    } ])).toEqual([ { label: translatedLabel, items: [ { label: translatedLabel } ] } ]);
  });

  it('should go to shopping', async () => {
    const routerSpy = jest.spyOn(routerMock, 'navigate');
    component.gotoShopping();

    expect(routerSpy).toBeCalled();
  });
});

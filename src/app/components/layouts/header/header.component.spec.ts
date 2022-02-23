import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterEvent, RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { MockModule, MockProvider } from 'ng-mocks';
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
import { UserInterface } from '../../../interfaces';
import { IngredientModel } from '../../../models';
import { TranslatingModule } from '../../../modules/translating.module';
import { FilterService, IngredientService, ShoppingService, TranslatorService, UserService } from '../../../services';
import { IngredientState } from '../../../stores/ingredient.state';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let userServiceMock: UserService;
  let shoppingServiceMock: ShoppingService;
  let ingredientServiceMock: IngredientService;
  let translatorServiceMock: TranslatorService;
  const routerEventsSubject = new Subject<RouterEvent>();

  const routerMock = {
    navigate: jest.fn(),
    events: routerEventsSubject.asObservable(),
  };

  //let store: Store;
  //let ingredientsSelectorSubject: Subject<IngredientInterface[]>;

  beforeEach(async () => {
    //await NgxsTestBed.configureTestingStates({states: [ IngredientState ]});
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
          MockProvider(FilterService),
          MockProvider(ShoppingService),
          //MockProvider(Router, routerMock)
          { provide: Router, useValue: routerMock }
        ],
    })
      .compileComponents();

    //ingredientsSelectorSubject = mockSelect(IngredientState.all);
    //store = TestBed.inject(Store);

    userServiceMock = TestBed.inject(UserService);
    shoppingServiceMock = TestBed.inject(ShoppingService);
    ingredientServiceMock = TestBed.inject(IngredientService);
    translatorServiceMock = TestBed.inject(TranslatorService);
    shoppingServiceMock.selectedRecipes = [];
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    //Object.defineProperty(component, 'ingredients$', {writable: true});
    //component['ingredients$'] = of([]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    const ingredients = [ 'ingredient1', 'ingredient2' ] as unknown as IngredientModel[];
    let translateMenuSpy: jest.SpyInstance;
    let noSleepSpy: jest.SpyInstance;

    beforeEach(() => {
      jest.spyOn(ingredientServiceMock, 'getListOrRefresh').mockReturnValue(Promise.resolve(ingredients));
      translateMenuSpy = jest.spyOn(component, 'translateMenu');
      noSleepSpy = jest.spyOn(component, 'noSleep', 'get');
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
      routerEventsSubject.next(new RoutesRecognized(1, '/', '', state));
      expect(component.title).toBe(title);
      expect(component.showFilters).toBe(true);
      expect(component.hideHeader).toBe(true);
      expect(component.showAppName).toBe(true);
      expect(noSleepSpy).toBeCalled();


      title = '';
      state = { root: { firstChild: { data: {} } } } as unknown as RouterStateSnapshot;
      routerEventsSubject.next(new RoutesRecognized(1, '/', '', state));
      expect(component.title).toBe(title);
      expect(component.showFilters).toBe(false);
      expect(component.hideHeader).toBe(false);
      expect(component.showAppName).toBe(false);
      expect(noSleepSpy).not.toBeCalled();
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

    it('should build logged menu', async () => {
      jest.spyOn(userServiceMock, 'getLoggedUser').mockImplementation((event?: (user?: UserInterface) => void): Promise<UserInterface | undefined> => {
        const user = {} as UserInterface;
        event!(user);
        return Promise.resolve(user);
      });
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
    } ])).toEqual([ { label: translatedLabel } ]);
  });

  it('should go to shopping', async () => {

  });

  it('should log out', async () => {

  });
});

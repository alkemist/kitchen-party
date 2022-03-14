import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontRecipesComponent } from './front-recipes.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockModule, MockProvider } from 'ng-mocks';
import { TranslateModule } from '@ngx-translate/core';
import {
  FilteringService,
  IngredientService,
  RecipeService,
  ShoppingService,
  TranslatorService
} from '@services';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { FormGroup } from '@angular/forms';

describe('FrontRecipesComponent', () => {
  let component: FrontRecipesComponent;
  let fixture: ComponentFixture<FrontRecipesComponent>;
  let filteringService: FilteringService;
  let recipeService: RecipeService;
  let filtersForm: FormGroup;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MockModule(TranslateModule),
        MockModule(ChipModule),
        MockModule(TagModule),
        MockModule(ButtonModule),
      ],
      providers: [
        MockProvider(RecipeService),
        MockProvider(IngredientService),
        MockProvider(FilteringService),
        MockProvider(ShoppingService),
        MockProvider(TranslatorService),
      ],
      declarations: [ FrontRecipesComponent ]
    })
      .compileComponents();

    filteringService = TestBed.inject(FilteringService);
    recipeService = TestBed.inject(RecipeService);
    filtersForm = new FormGroup({});
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontRecipesComponent);
    component = fixture.componentInstance;

    jest.spyOn(filteringService, 'getFilters').mockReturnValue(filtersForm);
    jest.spyOn(recipeService, 'getListOrRefresh').mockResolvedValue([]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

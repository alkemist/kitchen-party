import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenIngredientsComponent } from './kitchen-ingredients.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockModule, MockProvider } from 'ng-mocks';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { KitchenIngredientService, TranslatorService } from '@services';

describe('KitchenIngredientsComponent', () => {
  let component: KitchenIngredientsComponent;
  let fixture: ComponentFixture<KitchenIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MockModule(TranslateModule),
        MockModule(TableModule),
        MockModule(ButtonModule),
        MockModule(InputTextModule),
        MockModule(MultiSelectModule),
      ],
      providers: [
        MockProvider(KitchenIngredientService),
        MockProvider(TranslatorService),
      ],
      declarations: [ KitchenIngredientsComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KitchenIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

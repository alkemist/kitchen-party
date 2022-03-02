import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenIngredientComponent } from './kitchen-ingredient.component';
import { MockDeclaration, MockModule, MockProvider } from 'ng-mocks';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { KitchenIngredientService, RecipeService, SearchService, TranslatorService } from '../../../../services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { FormKitchenIngredientComponent } from '../../../forms/kitchen-ingredient/form-kitchen-ingredient.component';
import { ButtonModule } from 'primeng/button';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

describe('KitchenIngredientComponent', () => {
  let component: KitchenIngredientComponent;
  let fixture: ComponentFixture<KitchenIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MockModule(TranslateModule),
        MockModule(CardModule),
        MockModule(ButtonModule),
        MockModule(BlockUIModule),
        MockModule(ConfirmDialogModule),
      ],
      providers: [
        MockProvider(RecipeService),
        MockProvider(KitchenIngredientService),
        MockProvider(SearchService),
        MockProvider(TranslatorService),
        MockProvider(ConfirmationService),
        MockProvider(MessageService),
      ],
      declarations: [ KitchenIngredientComponent, MockDeclaration(FormKitchenIngredientComponent) ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KitchenIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeComponent } from './recipe.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDeclaration, MockModule, MockProvider } from 'ng-mocks';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {
  IngredientService,
  RecipeService,
  SearchService,
  TranslatorService,
  UploadService
} from '../../../../services';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormKitchenIngredientComponent } from '../../../forms/kitchen-ingredient/form-kitchen-ingredient.component';
import { BlockUIModule } from 'primeng/blockui';

describe('RecipeComponent', () => {
  let component: RecipeComponent;
  let fixture: ComponentFixture<RecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MockModule(ConfirmDialogModule),
        MockModule(CardModule),
        MockModule(ButtonModule),
        MockModule(InputTextModule),
        MockModule(InputNumberModule),
        MockModule(InputTextareaModule),
        MockModule(AccordionModule),
        MockModule(DropdownModule),
        MockModule(ImageModule),
        MockModule(FileUploadModule),
        MockModule(TranslateModule),
        MockModule(BlockUIModule),
      ],
      providers: [
        MockProvider(IngredientService),
        MockProvider(RecipeService),
        MockProvider(TranslatorService),
        MockProvider(ConfirmationService),
        MockProvider(MessageService),
        MockProvider(SearchService),
        MockProvider(UploadService),
        MockProvider(FilterService),
        MockProvider(DialogService),
      ],
      declarations: [ RecipeComponent,
        MockDeclaration(FormKitchenIngredientComponent),
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientComponent } from './ingredient.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockDeclaration, MockModule, MockProvider } from 'ng-mocks';
import { IngredientService, TranslatorService } from '../../../../services';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormIngredientComponent } from '../../../forms/ingredient/ingredient.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

describe('IngredientComponent', () => {
  let component: IngredientComponent;
  let fixture: ComponentFixture<IngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        MockModule(ConfirmDialogModule),
        MockModule(TranslateModule),
      ],
      providers: [
        MockProvider(IngredientService),
        MockProvider(TranslatorService),
        MockProvider(ConfirmationService),
        MockProvider(MessageService),
      ],
      declarations: [ IngredientComponent, MockDeclaration(FormIngredientComponent) ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

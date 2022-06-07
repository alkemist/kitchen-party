import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogIngredientComponent } from './dialog-ingredient.component';
import { MockDeclaration, MockProvider } from 'ng-mocks';
import { IngredientService, TranslatorService } from '@services';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormIngredientComponent } from '../../forms/ingredient/form-ingredient.component';

describe('DialogIngredientComponent', () => {
  let component: DialogIngredientComponent;
  let fixture: ComponentFixture<DialogIngredientComponent>;
  let ingredientService: IngredientService;
  let translatorService: TranslatorService;
  let messageService: MessageService;
  let ref: DynamicDialogRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogIngredientComponent, MockDeclaration(FormIngredientComponent) ],
      providers: [
        MockProvider(IngredientService),
        MockProvider(TranslatorService),
        MockProvider(MessageService),
        MockProvider(DynamicDialogRef),
      ]
    })
      .compileComponents();
    ingredientService = TestBed.inject(IngredientService);
    translatorService = TestBed.inject(TranslatorService);
    messageService = TestBed.inject(MessageService);
    ref = TestBed.inject(DynamicDialogRef);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

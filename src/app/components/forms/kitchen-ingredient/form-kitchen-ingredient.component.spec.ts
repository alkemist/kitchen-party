import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormKitchenIngredientComponent } from './form-kitchen-ingredient.component';
import { MockModule } from 'ng-mocks';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CheckboxModule } from 'primeng/checkbox';

describe('FormKitchenIngredientComponent', () => {
  let component: FormKitchenIngredientComponent;
  let fixture: ComponentFixture<FormKitchenIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MockModule(InputNumberModule),
        MockModule(DropdownModule),
        MockModule(AutoCompleteModule),
        MockModule(CheckboxModule),
      ],
      declarations: [ FormKitchenIngredientComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormKitchenIngredientComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      quantity: new FormControl('', []),
      unitOrMeasure: new FormControl('', []),
      ingredientOrRecipe: new FormControl('', [ Validators.required ]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event', () => {
    const eventSpy = jest.spyOn(component.searchIngredientOrRecipeEvent, 'emit');
    const event = { query: 'test' };
    component.searchIngredientOrRecipe(event);
    expect(eventSpy).toBeCalledWith(event);
  });
});

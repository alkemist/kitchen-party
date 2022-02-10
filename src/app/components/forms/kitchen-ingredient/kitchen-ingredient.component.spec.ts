import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormKitchenIngredientComponent} from "./kitchen-ingredient.component";

describe('FormKitchenIngredientComponent', () => {
  let component: FormKitchenIngredientComponent;
  let fixture: ComponentFixture<FormKitchenIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormKitchenIngredientComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormKitchenIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

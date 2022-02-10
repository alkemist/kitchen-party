import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormIngredientComponent} from "./ingredient.component";

describe('IngredientComponent', () => {
  let component: FormIngredientComponent;
  let fixture: ComponentFixture<FormIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormIngredientComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIngredientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

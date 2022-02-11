import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DialogIngredientComponent} from "./ingredient.component";

describe('DialogIngredientComponent', () => {
  let component: DialogIngredientComponent;
  let fixture: ComponentFixture<DialogIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogIngredientComponent]
    })
      .compileComponents();
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

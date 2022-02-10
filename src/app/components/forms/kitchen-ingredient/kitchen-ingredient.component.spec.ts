import {ComponentFixture, TestBed} from '@angular/core/testing';
import {KitchenIngredientComponent} from "../../views/backend/kitchen-ingredient/kitchen-ingredient.component";

describe('KitchenIngredientComponent', () => {
  let component: KitchenIngredientComponent;
  let fixture: ComponentFixture<KitchenIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KitchenIngredientComponent]
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

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {KitchenIngredientsComponent} from './kitchen-ingredients.component';

describe('KitchenIngredientsComponent', () => {
  let component: KitchenIngredientsComponent;
  let fixture: ComponentFixture<KitchenIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KitchenIngredientsComponent]
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

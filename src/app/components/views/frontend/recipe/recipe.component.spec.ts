import {ComponentFixture, TestBed} from '@angular/core/testing';

import {FrontRecipeComponent} from './recipe.component';

describe('FrontRecipeComponent', () => {
  let component: FrontRecipeComponent;
  let fixture: ComponentFixture<FrontRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FrontRecipeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { productFormComponent } from './product-form.component';

describe('productFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<productFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ productFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(productFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

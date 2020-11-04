import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { productListComponent } from './product-list.component';

describe('productListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<productListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ productListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(productListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

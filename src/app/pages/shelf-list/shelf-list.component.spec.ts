import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfListComponent } from './shelf-list.component';

describe('ShelfListComponent', () => {
  let component: ShelfListComponent;
  let fixture: ComponentFixture<ShelfListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShelfListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

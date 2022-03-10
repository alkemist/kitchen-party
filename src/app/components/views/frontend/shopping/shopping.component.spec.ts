import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockModule, MockProvider } from 'ng-mocks';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ShoppingService } from '@services';

import { ShoppingComponent } from './shopping.component';

describe('ShoppingComponent', () => {
  let component: ShoppingComponent;
  let fixture: ComponentFixture<ShoppingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MockModule(CardModule),
        MockModule(CheckboxModule),
        MockModule(TranslateModule),
      ],
      providers: [
        MockProvider(ShoppingService),
      ],
      declarations: [ ShoppingComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ShoppingComponent.cartOrderedByChecked', function () {

  });

  describe('ShoppingComponent.ngOnInit', function () {

  });
});

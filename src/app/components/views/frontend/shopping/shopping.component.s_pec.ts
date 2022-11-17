import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ShoppingComponent } from '@components';
import { TranslateModule } from '@ngx-translate/core';
import { ShoppingService } from '@services';
import { MockModule, MockProvider } from 'ng-mocks';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';

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

  /*describe('ShoppingComponent.cartOrderedByChecked', () => {

  });

  describe('ShoppingComponent.ngOnInit', () => {

  });*/
});

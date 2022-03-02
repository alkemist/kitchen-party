import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormIngredientComponent } from './form-ingredient.component';
import { MockModule } from 'ng-mocks';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CalendarModule } from 'primeng/calendar';
import { BlockUIModule } from 'primeng/blockui';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnumHelper } from '../../../tools';
import { IngredientTypeLabelEnum } from '../../../enums';

describe('IngredientComponent', () => {
  let component: FormIngredientComponent;
  let fixture: ComponentFixture<FormIngredientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MockModule(CardModule),
        MockModule(ButtonModule),
        MockModule(DropdownModule),
        MockModule(ToggleButtonModule),
        MockModule(CalendarModule),
        MockModule(BlockUIModule),
        MockModule(TranslateModule),
      ],
      declarations: [ FormIngredientComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormIngredientComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      type: new FormControl('', [
        Validators.required,
        Validators.pattern(new RegExp(EnumHelper.enumToRegex(IngredientTypeLabelEnum)))
      ]),
      isLiquid: new FormControl('', []),
      dateBegin: new FormControl('', []),
      dateEnd: new FormControl('', []),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

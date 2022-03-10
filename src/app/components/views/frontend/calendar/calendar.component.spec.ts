import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarComponent } from '@components';
import { NgxsModule } from '@ngxs/store';
import { TranslatorService } from '@services';
import { IngredientState } from '@stores';
import { MockProvider } from 'ng-mocks';


describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([ IngredientState ], {
          developmentMode: true
        })
      ],
      providers: [
        MockProvider(TranslatorService)
      ],
      declarations: [ CalendarComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

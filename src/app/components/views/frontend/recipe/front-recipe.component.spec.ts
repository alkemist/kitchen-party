import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockModule, MockProvider } from 'ng-mocks';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { TranslatorService, UserService } from '../../../../services';

import { FrontRecipeComponent } from './front-recipe.component';

describe('FrontRecipeComponent', () => {
  let component: FrontRecipeComponent;
  let fixture: ComponentFixture<FrontRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MockModule(TranslateModule),
        MockModule(CardModule),
        MockModule(TagModule),
        MockModule(ButtonModule),
      ],
      providers: [
        MockProvider(TranslatorService),
        MockProvider(UserService),
      ],
      declarations: [ FrontRecipeComponent ]
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

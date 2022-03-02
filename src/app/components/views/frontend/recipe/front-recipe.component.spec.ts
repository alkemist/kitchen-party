import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontRecipeComponent } from './front-recipe.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MockModule, MockProvider } from 'ng-mocks';
import { TranslatorService, UserService } from '../../../../services';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

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

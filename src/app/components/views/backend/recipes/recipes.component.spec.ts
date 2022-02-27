import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesComponent } from './recipes.component';
import { MockModule, MockProvider } from 'ng-mocks';
import { TableModule } from 'primeng/table';
import { RouterTestingModule } from '@angular/router/testing';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RecipeService, TranslatorService } from '../../../../services';

describe('RecipesComponent', () => {
  let component: RecipesComponent;
  let fixture: ComponentFixture<RecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MockModule(TableModule),
        MockModule(InputTextModule),
        MockModule(MultiSelectModule),
      ],
      providers: [
        MockProvider(TranslatorService),
        MockProvider(RecipeService),
      ],
      declarations: [ RecipesComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

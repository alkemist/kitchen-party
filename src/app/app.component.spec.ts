import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from '@app/app.component';
import { TranslatingRootModule } from '@app/modules/translating.module';
import { HeaderComponent } from '@components';
import { TranslateService } from '@ngx-translate/core';
import { MockDeclaration, MockModule } from 'ng-mocks';
import { PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let translateServiceMock: TranslateService;
  let primeNgConfigMock: PrimeNGConfig;
  const streamObservable = new Subject();
  let primeNgConfigSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MockModule(TranslatingRootModule),
        MockModule(ToastModule),
      ],
      declarations: [
        AppComponent,
        MockDeclaration(HeaderComponent),
      ],
      providers: []
    }).compileComponents();

    translateServiceMock = TestBed.inject(TranslateService);
    primeNgConfigMock = TestBed.inject(PrimeNGConfig);
  });

  beforeEach(() => {
    jest.spyOn(translateServiceMock, 'stream').mockReturnValue(streamObservable);
    primeNgConfigSpy = jest.spyOn(primeNgConfigMock, 'setTranslation');

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('AppComponent.constructor', () => {
    const translations = [ 'translations' ];

    it('should config primeNg', () => {
      streamObservable.next(translations);
      expect(primeNgConfigSpy).toBeCalledWith(translations);
    });
  });
});

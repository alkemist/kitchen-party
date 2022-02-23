import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { TranslatingModule } from './modules/translating.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let translateServiceMock: TranslateService;
  let primeNgConfigMock: PrimeNGConfig;
  const streamObservable = new Subject();
  let primeNgConfigSpy: jest.SpyInstance;

  @Component({ selector: 'app-header', template: '' })
  class HeaderStubComponent {
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslatingModule,
        ToastModule,
      ],
      declarations: [
        AppComponent,
        HeaderStubComponent,
      ],
      providers: [
        MessageService
      ]
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

  describe('constructor', () => {
    const translations = [ 'translations' ];

    it('should config primeNg', () => {
      streamObservable.next(translations);
      expect(primeNgConfigSpy).toBeCalledWith(translations);
    });
  });
});

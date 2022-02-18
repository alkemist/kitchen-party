import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppComponent } from './app.component';
import { TranslatingModule } from './modules/translating.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  @Component({selector: 'app-header', template: ''})
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { TranslatorService } from '@services';
import { TranslatorPipe } from './translator.pipe';

describe('TranslatorPipe', () => {
  let translatorServiceMock: TranslatorService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({
        providers: [
          MockProvider(TranslatorService)
        ]
      });

    translatorServiceMock = TestBed.inject(TranslatorService);
  });
  
  it('create an instance', () => {
    const pipe = new TranslatorPipe(translatorServiceMock);
    expect(pipe).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { LoggedGuard } from './logged.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { MockProvider } from 'ng-mocks';
import { UserService } from '../services';

describe('LoggedGuard', () => {
  let guard: LoggedGuard;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        MockProvider(UserService),
      ]
    });
    guard = TestBed.inject(LoggedGuard);
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

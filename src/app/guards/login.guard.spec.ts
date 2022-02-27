import { TestBed } from '@angular/core/testing';

import { LoginGuard } from './login.guard';
import { MockProvider } from 'ng-mocks';
import { UserService } from '../services';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginGuard', () => {
  let guard: LoginGuard;
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
    guard = TestBed.inject(LoginGuard);
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

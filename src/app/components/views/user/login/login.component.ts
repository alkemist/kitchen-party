import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '@services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup;
  error: string = '';

  constructor(private userService: UserService, private router: Router) {
    this.form = new UntypedFormGroup({
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new UntypedFormControl('', [
        Validators.required,
      ]),
    });
  }

  get email(): UntypedFormControl {
    return this.form.get('email') as UntypedFormControl;
  }

  get password(): UntypedFormControl {
    return this.form.get('password') as UntypedFormControl;
  }

  ngOnInit(): void {

  }

  async handleSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      try {
        await this.userService.login(this.form.value.email, this.form.value.password)
          .then(() => {
            this.router.navigate([ '/', 'admin' ]);
          });
      } catch (error) {
        this.error = (error as Error).message;
      }
    }
  }
}

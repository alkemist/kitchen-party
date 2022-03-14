import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  error: string = '';

  constructor(private userService: UserService, private router: Router) {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  ngOnInit(): void {

  }

  async handleSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      try {
        await this.userService.login(this.form.value.email, this.form.value.password)
          .then(() => {
            this.router.navigate([ '/', 'logged' ]);
          });
      } catch (error) {
        this.error = (error as Error).message;
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { UserService } from '@services';
import BaseComponent from '@app/components/base.component';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: [ "./login.component.scss" ],
  host: {
    class: "page-container"
  },
})
export class LoginComponent extends BaseComponent implements OnInit {
  constructor(
    private userService: UserService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  handleSubmit() {
    this.userService.login();
  }
}

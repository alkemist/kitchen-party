import { Injectable } from '@angular/core';
import { DataStoreUserService } from '@alkemist/ngx-data-store';
import { Router } from '@angular/router';


@Injectable({
  providedIn: "root"
})
export class UserService extends DataStoreUserService<Record<string, any>> {
  constructor(
    protected router: Router,
  ) {
    super();
  }

  override async logout() {
    await super.logout();
    return Promise.resolve();
  }
}

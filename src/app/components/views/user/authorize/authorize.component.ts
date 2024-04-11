import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "@services";
import { combineLatest } from "rxjs";
import { DataStoreConfigurationProvider } from '@alkemist/ngx-data-store';
import BaseComponent from '@app/components/base.component';

@Component({
  selector: "app-authorize",
  templateUrl: "./authorize.component.html",
  styleUrls: [ "./authorize.component.scss" ],
  host: {
    class: "page-container"
  },
})
export class AuthorizeComponent extends BaseComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private configuration: DataStoreConfigurationProvider,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub = combineLatest([
      this.route.params,
      this.route.queryParams,
    ])
      .subscribe(async (mixedData) => {
        const [ { type }, { code } ] = mixedData as [ { type: string }, { code: string } ];

        if (type && code) {
          this.updateToken(type, code).then(() => {
            void this.router.navigate([ this.configuration.front_logged_path ]);
          });
        } else {
          throw new Error(`[Authorize] Unknown type or token`)
        }
      });
  }

  updateToken(type: string, authorizationCode: string) {
    if (type === "google") {
      this.userService.setToken(authorizationCode);
      return Promise.resolve({});
    }

    return Promise.reject();
  }
}

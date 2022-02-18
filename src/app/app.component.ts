import {Component, OnDestroy} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {PrimeNGConfig} from 'primeng/api';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  subscription: Subscription;

  constructor(private translateService: TranslateService, private primeNgConfig: PrimeNGConfig) {
    this.translateService.setDefaultLang('fr');
    this.translateService.use('fr');

    this.subscription = this.translateService.stream('primeng').subscribe((data: any) => {
      this.primeNgConfig.setTranslation(data);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

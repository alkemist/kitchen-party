import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharingModule } from '@app/modules/sharing.module';
import { TranslatingChildModule } from '@app/modules/translating.module';
import { UserRoutingModule } from '@app/modules/user/user-routing.module';
import { LoginComponent } from '@components';


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharingModule,
    TranslatingChildModule,
  ]
})
export class UserModule {
}

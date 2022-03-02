import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SharingModule } from '../sharing.module';
import { LoginComponent } from '../../components/views/user/login/login.component';
import { TranslatingChildModule } from '../translating.module';


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

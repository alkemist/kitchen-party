import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoginComponent } from '@components';
import { SharingModule, TranslatingChildModule, UserRoutingModule } from '@modules';


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

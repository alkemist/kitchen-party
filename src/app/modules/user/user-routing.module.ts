import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@components';
import { logginInGuard } from '@alkemist/ngx-data-store';
import { AuthorizeComponent } from '@app/components/views/user/authorize/authorize.component';

const routes: Routes = [
  { path: '', redirectTo: '/user/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [ logginInGuard ], data: { title: 'Login' } },
  {
    path: "authorize/:type",
    canActivate: [ logginInGuard ],
    component: AuthorizeComponent,
    data: { title: 'Authorization' }
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class UserRoutingModule {
}

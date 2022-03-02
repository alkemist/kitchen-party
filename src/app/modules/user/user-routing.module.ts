import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../../components/views/user/login/login.component';
import { LoginGuard } from '../../guards/login.guard';

const routes: Routes = [
  { path: '', redirectTo: '/user/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [ LoginGuard ], data: { title: 'Login' } },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class UserRoutingModule {
}

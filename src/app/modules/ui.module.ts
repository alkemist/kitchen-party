import {NgModule} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {MenuModule} from 'primeng/menu';
import {PasswordModule} from 'primeng/password';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TableModule} from 'primeng/table';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ToolbarModule} from 'primeng/toolbar';

const modules = [
  ToolbarModule,
  PasswordModule,
  InputTextModule,
  CardModule,
  ButtonModule,
  MenuModule,
  DropdownModule,
  SelectButtonModule,
  TableModule,
  ToggleButtonModule
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class UiModule {
}

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiModule } from './ui.module';

const modules = [
  FormsModule,
  ReactiveFormsModule,
  UiModule,
]

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules,
})
export class SharingModule {
}

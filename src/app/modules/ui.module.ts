import {NgModule} from '@angular/core';
import {AccordionModule} from 'primeng/accordion';
import {ConfirmationService, FilterService, MessageService} from 'primeng/api';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {BlockUIModule} from 'primeng/blockui';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DataViewModule} from 'primeng/dataview';
import {DropdownModule} from 'primeng/dropdown';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {MultiSelectModule} from 'primeng/multiselect';
import {PasswordModule} from 'primeng/password';
import {SelectButtonModule} from 'primeng/selectbutton';
import {SidebarModule} from 'primeng/sidebar';
import {TableModule} from 'primeng/table';
import {TagModule} from 'primeng/tag';
import {ToastModule} from 'primeng/toast';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {ToolbarModule} from 'primeng/toolbar';
import {FileUploadModule} from "primeng/fileupload";
import {ImageModule} from "primeng/image";
import {TooltipModule} from "primeng/tooltip";
import {CheckboxModule} from "primeng/checkbox";
import {CalendarModule} from "primeng/calendar";
import {ChipModule} from "primeng/chip";
import {TieredMenuModule} from "primeng/tieredmenu";

const modules = [
  ToolbarModule,
  PasswordModule,
  InputTextModule,
  CardModule,
  ButtonModule,
  DropdownModule,
  SelectButtonModule,
  TableModule,
  ToggleButtonModule,
  ConfirmDialogModule,
  ToastModule,
  MultiSelectModule,
  InputNumberModule,
  AutoCompleteModule,
  InputTextareaModule,
  AccordionModule,
  DataViewModule,
  TagModule,
  BlockUIModule,
  SidebarModule,
  DynamicDialogModule,
  FileUploadModule,
  ImageModule,
  TooltipModule,
  CheckboxModule,
  CalendarModule,
  ChipModule,
  TieredMenuModule
];

@NgModule({
  imports: modules,
  exports: modules,
  providers: [ConfirmationService, MessageService, DialogService, FilterService],
})
export class UiModule {
}

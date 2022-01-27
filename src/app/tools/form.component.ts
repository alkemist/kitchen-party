import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DataObject} from '../services/firestore.service';

interface DocumentService<T> {
  add(document: T): Promise<T>;

  update(document: T): Promise<T>;

  remove(document: T): Promise<void>;

  exist(name: string): Promise<boolean>;
}

export class FormComponent<T extends DataObject> {
  documentService: DocumentService<T>;
  form: FormGroup = new FormGroup({});
  document: T = {} as T;
  loading = true;
  error: string = '';
  protected routerService: Router;
  protected confirmationService: ConfirmationService;
  protected translateService: TranslateService;
  protected messageService: MessageService;

  constructor(
    private documentName: string,
    documentService: DocumentService<T>,
    routerService: Router,
    confirmationService: ConfirmationService,
    translateService: TranslateService,
    messageService: MessageService
  ) {
    this.documentService = documentService;
    this.routerService = routerService;
    this.confirmationService = confirmationService;
    this.translateService = translateService;
    this.messageService = messageService;
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  async preSubmit(formDocument: T): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.document.id) {
        formDocument.id = this.document.id;
      }

      const checkExist = !this.document.id || formDocument.name !== this.document.name;

      if (checkExist) {
        this.documentService.exist(formDocument.name!).then(async exist => {
          if (exist) {
            return this.name.setErrors({'exist': true});
          }
          await this.submit(formDocument);
        });
      } else {
        await this.submit(formDocument);
      }
    }
  }

  async submit(localDocument: T): Promise<void> {
    if (this.document.id) {
      this.document = await this.documentService.update(localDocument);
      this.messageService.add({
        severity: 'success',
        detail: this.translateService.instant(`Updated ${this.documentName}`)
      });
    } else {
      this.document = await this.documentService.add(localDocument);
      this.messageService.add({
        severity: 'success',
        detail: this.translateService.instant(`Added ${this.documentName}`)
      });
    }
    await this.routerService.navigate(['/', this.documentName, this.document.slug]);
  }

  async remove(localDocument: T): Promise<void> {
    this.confirmationService.confirm({
      message: this.translateService.instant('Are you sure you want to delete it ?'),
      accept: async () => {
        await this.documentService.remove(localDocument);
        await this.routerService.navigate(['/', this.documentName + 's']);
        this.messageService.add({
          severity: 'success',
          detail: this.translateService.instant(`Deleted ${this.documentName}`)
        });
      }
    });
  }
}

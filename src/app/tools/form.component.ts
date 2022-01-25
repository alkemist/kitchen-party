import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {DataObject} from '../services/firestore.service';

interface DocumentService<T> {
  update(document: T): Promise<T>;

  add(document: T): Promise<T>;

  exist(name: string): Promise<boolean>;
}

export class FormComponent<T extends DataObject> {
  documentService: DocumentService<T>;
  form: FormGroup = new FormGroup({});
  document: T = {} as T;
  loading = true;
  error: string = '';
  private routerService: Router;

  constructor(private baseRoute: string, documentService: DocumentService<T>, routerService: Router) {
    this.documentService = documentService;
    this.routerService = routerService;
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
    } else {
      this.document = await this.documentService.add(localDocument);
    }
    await this.routerService.navigate(['/', this.baseRoute, this.document.slug]);
  }
}

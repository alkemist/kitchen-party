import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {IngredientTypeEnum} from '../../../enums/ingredient-type.enum';
import {IngredientInterface, IngredientModel} from '../../../models/ingredient.model';
import {IngredientService} from '../../../services/ingredient.service';
import {EnumHelper} from '../../../tools/enum.helper';

@Component({
  selector: 'app-dialog-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss']
})
export class DialogIngredientComponent implements OnInit {
  ingredient = new IngredientModel({} as IngredientInterface);
  ingredientTypes = EnumHelper.enumToObject(IngredientTypeEnum);

  form: FormGroup = new FormGroup({});
  loading = false;
  error: string = '';

  constructor(
    private ingredientService: IngredientService,
    private translateService: TranslateService,
    private messageService: MessageService,
    private ref: DynamicDialogRef
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      type: new FormControl('', [
        Validators.required,
        Validators.pattern(new RegExp(EnumHelper.enumToRegex(IngredientTypeEnum)))
      ]),
      isLiquid: new FormControl('', []),
    });
  }

  get name(): FormControl {
    return this.form?.get('name') as FormControl;
  }

  ngOnInit() {
    this.translateService.getTranslation('fr').subscribe(() => {
      this.ingredientTypes = this.ingredientTypes.map(item => {
        return {...item, label: this.translateService.instant(item.label)};
      });
    });
  }

  async handleSubmit(): Promise<void> {
    const formIngredient = new IngredientModel(this.form.value);
    await this.preSubmit(formIngredient);
  }

  async preSubmit(formDocument: IngredientModel): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.ingredient.id) {
        formDocument.id = this.ingredient.id;
      }

      const checkExist = !this.ingredient.id || formDocument.name !== this.ingredient.name;

      if (checkExist) {
        this.ingredientService.exist(formDocument.name!).then(async exist => {
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

  close() {
    this.ref.close();
  }

  async submit(localDocument: IngredientModel): Promise<void> {
    this.loading = true;
    await this.ingredientService.add(localDocument).then(ingredient => {
      this.ingredient = ingredient;
      this.loading = false;
      this.messageService.add({
        severity: 'success',
        detail: this.translateService.instant(`Added ingredient`),
      });
      this.close();
    });
  }
}

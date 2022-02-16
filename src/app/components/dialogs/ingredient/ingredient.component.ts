import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {IngredientTypeEnum} from '../../../enums/ingredient-type.enum';
import {IngredientInterface, IngredientModel} from '../../../models/ingredient.model';
import {IngredientService} from '../../../services/ingredient.service';
import {TranslatorService} from '../../../services/translator.service';
import {EnumHelper} from '../../../tools/enum.helper';
import {slugify} from '../../../tools/slugify';

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
    private translatorService: TranslatorService,
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
      dateBegin: new FormControl('', []),
      dateEnd: new FormControl('', []),
    });
  }

  get name(): FormControl {
    return this.form?.get('name') as FormControl;
  }

  async ngOnInit() {
    this.ingredientTypes = await this.translatorService.translateLabels(this.ingredientTypes);
  }

  async handleSubmit(): Promise<void> {
    await this.preSubmit(IngredientModel.format(this.form.value));
  }

  async preSubmit(formDocument: IngredientInterface): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.ingredient.id) {
        formDocument.id = this.ingredient.id;
      }

      const checkExist = !this.ingredient.id || slugify(formDocument.name) !== slugify(this.ingredient.name);

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

  async submit(localDocument: IngredientInterface): Promise<void> {
    this.loading = true;
    await this.ingredientService.add(localDocument).then(async ingredient => {
      this.ingredient = new IngredientModel(ingredient!);
      this.loading = false;
      this.messageService.add({
        severity: 'success',
        detail: await this.translatorService.instant(`Added ingredient`),
      });
      this.close();
    });
  }
}

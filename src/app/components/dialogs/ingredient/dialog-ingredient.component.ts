import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IngredientTypeLabelEnum } from '../../../enums';
import { IngredientInterface } from '../../../interfaces';
import { IngredientModel } from '../../../models';
import { IngredientService, TranslatorService } from '../../../services';
import { EnumHelper, slugify } from '../../../tools';

@Component({
  selector: 'app-dialog-ingredient',
  templateUrl: './dialog-ingredient.component.html',
  styleUrls: [ './dialog-ingredient.component.scss' ]
})
export class DialogIngredientComponent implements OnInit {
  ingredient = new IngredientModel({});
  ingredientTypes = EnumHelper.enumToObject(IngredientTypeLabelEnum);

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
        Validators.pattern(new RegExp(EnumHelper.enumToRegex(IngredientTypeLabelEnum)))
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

  async preSubmit(ingredient: IngredientInterface): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      if (this.ingredient.id) {
        ingredient.id = this.ingredient.id;
      }

      const checkExist = !this.ingredient.id || slugify(ingredient.name) !== slugify(this.ingredient.name);

      if (checkExist) {
        this.ingredientService.exist(ingredient.name!).then(async exist => {
          if (exist) {
            return this.name.setErrors({'exist': true});
          }
          await this.submit(ingredient);
        });
      } else {
        await this.submit(ingredient);
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

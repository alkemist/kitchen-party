import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {IngredientTypeEnum} from '../../../../enums/ingredient-type.enum';
import {IngredientInterface, IngredientModel} from '../../../../models/ingredient.model';
import {IngredientService} from '../../../../services/ingredient.service';
import {EnumHelper} from '../../../../tools/enum.helper';

@Component({
  selector: 'app-back-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class IngredientComponent implements OnInit {
  ingredient = new IngredientModel({} as IngredientInterface);
  ingredientTypes = EnumHelper.enumToObject(IngredientTypeEnum);

  form: FormGroup = new FormGroup({});
  loading = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private ingredientService: IngredientService,
    private routerService: Router,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
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
    this.route.data.subscribe(
      (data => {
        if (data && data['ingredient']) {
          this.ingredient = data['ingredient'];
          this.form.patchValue(this.ingredient);
        }
        this.loading = false;
      }));
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

  async submit(localDocument: IngredientModel): Promise<void> {
    this.loading = true;
    if (this.ingredient.id) {
      this.ingredientService.update(localDocument).then(ingredient => {
        this.ingredient = ingredient;
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: this.translateService.instant(`Updated ingredient`)
        });
        this.routerService.navigate(['/', 'ingredient', this.ingredient.slug]);
      });
    } else {
      await this.ingredientService.add(localDocument).then(ingredient => {
        this.ingredient = ingredient;
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: this.translateService.instant(`Added ingredient`),
        });
        this.routerService.navigate(['/', 'ingredient', this.ingredient.slug]);
      });
    }
  }

  async remove(): Promise<void> {
    this.confirmationService.confirm({
      message: this.translateService.instant('Are you sure you want to delete it ?'),
      accept: () => {
        this.ingredientService.remove(this.ingredient).then(() => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            detail: this.translateService.instant(`Deleted ingredient`)
          });
          this.routerService.navigate(['/', 'ingredients']);
        });
      }
    });
  }
}

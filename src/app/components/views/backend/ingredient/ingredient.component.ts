import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {IngredientTypeLabelEnum} from '@enums';
import {IngredientInterface} from '@interfaces';
import {IngredientModel} from '@models';
import {IngredientService, TranslatorService} from '@services';
import {EnumHelper, slugify} from '@tools';
import {ConfirmationService, MessageService} from 'primeng/api';

@Component({
  selector: 'app-back-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class IngredientComponent implements OnInit, AfterViewChecked {
  ingredient = new IngredientModel({});
  ingredientTypes = EnumHelper.enumToObject(IngredientTypeLabelEnum);

  form: UntypedFormGroup = new UntypedFormGroup({});
  loading = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private ingredientService: IngredientService,
    private routerService: Router,
    private translatorService: TranslatorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl('', [
        Validators.required
      ]),
      type: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(new RegExp(EnumHelper.enumToRegex(IngredientTypeLabelEnum)))
      ]),
      isLiquid: new UntypedFormControl('', []),
      dateBegin: new UntypedFormControl('', []),
      dateEnd: new UntypedFormControl('', []),
    });
  }

  get name(): UntypedFormControl {
    return this.form?.get('name') as UntypedFormControl;
  }

  async ngOnInit(): Promise<void> {
    this.ingredientTypes = await this.translatorService.translateLabels(this.ingredientTypes);
    this.loadData();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  loadData() {
    this.route.data.subscribe(
      ((data: any) => {
        if (data && data['ingredient']) {
          this.ingredient = data['ingredient'];
          this.form.patchValue(this.ingredient);
          this.form.get('dateBegin')?.patchValue(this.ingredient.monthBegin
            ? new Date(new Date().getFullYear(), this.ingredient.monthBegin - 1, 1)
            : null);
          this.form.get('dateEnd')?.patchValue(this.ingredient.monthEnd
            ? new Date(new Date().getFullYear(), this.ingredient.monthEnd - 1, 1)
            : null);
        }
        this.loading = false;
      }));
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

  async submit(localDocument: IngredientInterface): Promise<void> {
    this.loading = true;
    if (this.ingredient.id) {
      this.ingredientService.update(localDocument).then(async ingredient => {
        this.ingredient = new IngredientModel(ingredient!);
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: await this.translatorService.instant(`Updated ingredient`)
        });
        await this.routerService.navigate([ '/', 'admin', 'ingredient', this.ingredient.slug ]);
      });
    } else {
      await this.ingredientService.add(localDocument).then(async ingredient => {
        this.ingredient = new IngredientModel(ingredient!);
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: await this.translatorService.instant(`Added ingredient`),
        });
        await this.routerService.navigate([ '/', 'admin', 'ingredient', this.ingredient.slug ]);
      });
    }
  }

  async remove(): Promise<void> {
    this.confirmationService.confirm({
      key: "ingredientConfirm",
      message: await this.translatorService.instant('Are you sure you want to delete it ?'),
      accept: () => {
        this.ingredientService.remove(this.ingredient).then(async () => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            detail: await this.translatorService.instant(`Deleted ingredient`)
          });
          await this.routerService.navigate(['/', 'admin', 'ingredients']);
        });
      }
    });
  }
}

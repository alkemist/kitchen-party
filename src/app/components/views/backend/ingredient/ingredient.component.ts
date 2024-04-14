import { AfterViewChecked, ChangeDetectorRef, Component, computed, OnInit, WritableSignal } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientTypeLabelEnum } from '@enums';
import { IngredientFormInterface, IngredientV2FrontInterface } from '@interfaces';
import { IngredientModel } from '@models';
import { IngredientService, IngredientV2Service, TranslatorService } from '@services';
import { EnumHelper } from '@tools';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IngredientV2State } from '@stores';
import { Observe } from '@alkemist/ngx-state-manager';

@Component({
  selector: 'app-back-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: [ './ingredient.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class IngredientComponent implements OnInit, AfterViewChecked {
  ingredientTypes = EnumHelper.enumToObject(IngredientTypeLabelEnum);
  form: UntypedFormGroup = new UntypedFormGroup({});
  loading = true;
  error: string = '';
  @Observe(IngredientV2State, IngredientV2State.item)
  protected _item!: WritableSignal<IngredientV2FrontInterface | null>;
  ingredient = computed(
    () =>
      this._item() !== null
        ? new IngredientModel(this._item()!)
        : new IngredientModel({})
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private ingredientService: IngredientService,
    private ingredientV2Service: IngredientV2Service,
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
    this.activatedRoute.data.subscribe(
      ((data: any) => {
        if (this.ingredient().id) {
          this.form.patchValue(this.ingredient().toForm());
          this.form.get('dateBegin')?.patchValue(this.ingredient().monthBegin
            ? new Date(new Date().getFullYear(), this.ingredient().monthBegin! - 1, 1)
            : null);
          this.form.get('dateEnd')?.patchValue(this.ingredient().monthEnd
            ? new Date(new Date().getFullYear(), this.ingredient().monthEnd! - 1, 1)
            : null);
        }
        this.loading = false;
      }));
  }

  async handleSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const ingredient = IngredientModel.import({
        id: this.ingredient().id,
        ...this.form.value as IngredientFormInterface
      });

      if (!await this.ingredientV2Service.exist(
        ingredient,
        this.ingredient() ? this.ingredient()!.id : undefined
      )) {
        void this.submit(ingredient);
      }
    }
  }

  async submit(ingredient: IngredientModel): Promise<void> {
    this.loading = true;

    if (this.ingredient().id) {
      this.ingredientV2Service.update(ingredient.id!, ingredient).then(_ => {
        this.loading = false;
        void this.routerService.navigate([ "../../ingredients" ], { relativeTo: this.activatedRoute });
      })
    } else {
      this.ingredientV2Service.add(ingredient).then(_ => {
        this.loading = false;
        void this.routerService.navigate([ "../../ingredients" ], { relativeTo: this.activatedRoute });
      })
    }
  }

  async remove(): Promise<void> {
    this.confirmationService.confirm({
      key: "ingredient",
      message: $localize`Are you sure you want to delete it ?`,
      accept: () => {
        this.loading = true;
        this.ingredientV2Service.delete(this.ingredient()!).then(async () => {
          this.loading = false;
          await this.routerService.navigate([ "../../ingredients" ], { relativeTo: this.activatedRoute });
        });
      }
    });
  }
}

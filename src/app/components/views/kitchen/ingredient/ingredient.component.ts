import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {IngredientTypeEnum} from '../../../../enums/ingredient-type.enum';
import {IngredientInterface, IngredientModel} from '../../../../models/ingredient.model';
import {IngredientService} from '../../../../services/ingredient.service';
import {EnumHelper} from '../../../../tools/enum.helper';
import {FormComponent} from '../../../../tools/form.component';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class IngredientComponent extends FormComponent<IngredientModel> implements OnInit {
  override document = new IngredientModel({} as IngredientInterface);
  ingredientTypes = EnumHelper.enumToObject(IngredientTypeEnum);

  constructor(
    private route: ActivatedRoute,
    private ingredientService: IngredientService,
    routerService: Router,
    translateService: TranslateService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
  ) {
    super('ingredient', ingredientService, routerService, confirmationService, translateService, messageService);
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

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  get isLiquid(): FormControl {
    return this.form.get('isLiquid') as FormControl;
  }

  ngOnInit() {
    this.route.data.subscribe(
      (data => {
        if (data && data['ingredient']) {
          this.document = data['ingredient'];
          this.form.patchValue(this.document);
        }
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
}

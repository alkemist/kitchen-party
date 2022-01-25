import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {IngredientType} from '../../../../enums/IngredientType';
import {IngredientInterface, IngredientModel} from '../../../../models/ingredient.model';
import {IngredientService} from '../../../../services/ingredient.service';
import {EnumHelper} from '../../../../tools/enum.helper';
import {FormComponent} from '../../../../tools/form.component';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
  host: {
    class: 'flex flex-grow-1 w-full'
  }
})
export class IngredientComponent extends FormComponent<IngredientModel> implements OnInit {
  override document = new IngredientModel({} as IngredientInterface);
  ingredientTypes = EnumHelper.enumToObject(IngredientType);

  constructor(private route: ActivatedRoute, private ingredientService: IngredientService, routerService: Router, private translaterService: TranslateService) {
    super('ingredient', ingredientService, routerService);
    this.translaterService.getTranslation('fr').subscribe(translations => {
      this.ingredientTypes.forEach(ingredient => {
        ingredient.label = translations[ingredient.label];
      });
    });
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      type: new FormControl('', [
        Validators.required,
        Validators.pattern(new RegExp(EnumHelper.enumToRegex(IngredientType)))
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
  }

  async handleSubmit(): Promise<void> {
    const formIngredient = new IngredientModel(this.form.value);
    await this.preSubmit(formIngredient);
  }
}

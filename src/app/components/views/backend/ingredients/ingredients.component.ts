import { Component, computed, OnInit, WritableSignal } from '@angular/core';
import { IngredientTypeLabelEnum } from '@enums';
import { IngredientModel } from '@models';
import { IngredientV2Service, TranslatorService } from '@services';
import { EnumHelper } from '@tools';
import { IngredientV2State } from '@stores';
import { Observe } from '@alkemist/ngx-state-manager';
import { IngredientV2FrontInterface } from '@interfaces';

@Component({
  selector: 'app-back-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: [ './ingredients.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class IngredientsComponent implements OnInit {
  ingredientTypes = EnumHelper.enumToObject(IngredientTypeLabelEnum);
  @Observe(IngredientV2State, IngredientV2State.items)
  protected _items!: WritableSignal<IngredientV2FrontInterface[]>;
  protected ingredients = computed(
    () => this._items().map(_item => new IngredientModel(_item))
  )

  constructor(
    private ingredientV2Service: IngredientV2Service,
    private translatorService: TranslatorService
  ) {
  }

  get loaded() {
    return this.ingredientV2Service.publicItemsLoaded;
  }

  async ngOnInit(): Promise<void> {
    this.ingredientTypes = await this.translatorService.translateLabels(this.ingredientTypes);
  }
}

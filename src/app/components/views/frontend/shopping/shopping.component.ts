import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MeasureUnitLabelEnum} from '@enums';
import {RecipeModel} from '@models';
import {ShoppingService} from '@services';
import {EnumHelper} from '@tools';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: [ './shopping.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class ShoppingComponent implements OnInit {
  measureUnits = EnumHelper.enumToObject(MeasureUnitLabelEnum);
  recipes: RecipeModel[] = [];

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private shoppingService: ShoppingService,
  ) {
  }

  // @TODO Remove
  /*get cart(): CartElement[] {
    return this.shoppingService.cartOrderedByChecked;
  }*/

  ngOnInit(): void {
    // @TODO Remove
    /*this.route.data.subscribe(
      (async (data: any) => {
        if (data && data['recipes']) {
          this.recipes = data['recipes'];

          await this.shoppingService.initIndexes();

          this.shoppingService.initCart(data['recipes']);
          await this.shoppingService.mergeCart();

          this.loading = false;
        }
      }));*/
  }
}

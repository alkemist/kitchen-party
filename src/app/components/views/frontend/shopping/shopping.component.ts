import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {RecipeModel} from "../../../../models/recipe.model";

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss'],
  host: {
    class: 'page-container'
  }
})
export class ShoppingComponent implements OnInit {
  recipes: RecipeModel[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data => {
        console.log(data);
        if (data && data['recipes']) {
          this.recipes = data['recipes'];
          this.loading = false;
          console.log(this.recipes);
        }
      }));
  }

}

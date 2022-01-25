import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {IngredientModel} from '../../../../models/ingredient.model';
import {IngredientService} from '../../../../services/ingredient.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.scss'],
  host: {
    class: 'flex flex-column flex-grow-1 w-full'
  }
})
export class IngredientsComponent implements OnInit {
  ingredients: IngredientModel[] = [];
  loading = true;

  constructor(private ingredientService: IngredientService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.ingredientService.refreshList().then(ingredients => {
      this.ingredients = ingredients;
      this.loading = false;
    });
  }
}

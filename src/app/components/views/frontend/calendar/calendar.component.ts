import { Component, OnInit } from '@angular/core';
import { IngredientInterface, MonthCalendarInterface } from '@interfaces';
import { IngredientModel } from '@models';
import { Select } from '@ngxs/store';
import { TranslatorService } from '@services';
import { IngredientState } from '@stores';
import { first, Observable } from 'rxjs';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: [ './calendar.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class CalendarComponent implements OnInit {
  months: MonthCalendarInterface[] = [];
  @Select(IngredientState.fruitsOrVegetables) protected fruitsOrVegetables$?: Observable<IngredientInterface[]>;

  constructor(private translatorService: TranslatorService) {
    this.fruitsOrVegetables$?.pipe(first()).subscribe(async ingredients => {
      const translations = await this.translatorService.instant('primeng') as any;
      const months = translations['monthNames'];
      for (let i = 0; i < 12; i++) {
        this.months.push({
          name: months[i],
          ingredients: []
        });
      }

      for (let ingredient of ingredients) {
        for (let i = 0; i < 12; i++) {
          const month = i + 1;
          if (
            ingredient.monthBegin! < ingredient.monthEnd! && month >= ingredient.monthBegin! && month <= ingredient.monthEnd!
            || ingredient.monthBegin! > ingredient.monthEnd! && month <= ingredient.monthBegin! && month >= ingredient.monthEnd!) {
            this.months[i].ingredients.push(new IngredientModel(ingredient));
          } else {
            this.months[i].ingredients.push(null);
          }
        }
      }
    });
  }

  ngOnInit(): void {


  }

}

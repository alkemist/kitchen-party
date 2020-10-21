import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {IngredientInterface} from '../../interfaces/ingredient';
import {merge, Observable, of} from 'rxjs';
import { MatSort } from '@angular/material/sort';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {IngredientApiService} from '../../services/ingredient-api.service';
import {IngredientStoreService} from '../../services/ingredient-store.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericListComponent} from '../../generics/generic-list.component';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss']
})
export class IngredientListComponent extends GenericListComponent<IngredientInterface> implements OnInit, AfterViewInit{
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public ingredientStore: IngredientStoreService,
    public snackBar: MatSnackBar
  ) {
    super(ingredientStore, snackBar);
  }

  ngOnInit(): void {
    super.onInit();
  }

  ngAfterViewInit(): void {
    super.afterViewInit();
  }
}

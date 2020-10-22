import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {productInterface} from '../../interfaces/product';
import {merge, Observable, of} from 'rxjs';
import { MatSort } from '@angular/material/sort';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {productApiService} from '../../services/product-api.service';
import {productStoreService} from '../../services/product-store.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericListComponent} from '../../generics/generic-list.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class productListComponent extends GenericListComponent<productInterface> implements OnInit, AfterViewInit{
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public productStore: productStoreService,
    public snackBar: MatSnackBar
  ) {
    super(productStore, snackBar);
  }

  ngOnInit(): void {
    super.onInit();
  }

  ngAfterViewInit(): void {
    super.afterViewInit();
  }
}

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MeasureInterface} from '../../interfaces/measure';
import {merge, Observable, of} from 'rxjs';
import { MatSort } from '@angular/material/sort';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MeasureApiService} from '../../services/measure-api.service';
import {MeasureStoreService} from '../../services/measure-store.service';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {MatSnackBar} from '@angular/material/snack-bar';
import {GenericListComponent} from '../../generics/generic-list.component';

@Component({
  selector: 'app-measure-list',
  templateUrl: './measure-list.component.html',
  styleUrls: ['./measure-list.component.scss']
})
export class MeasureListComponent extends GenericListComponent<MeasureInterface> implements OnInit, AfterViewInit{
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    public measureStore: MeasureStoreService,
    public snackBar: MatSnackBar
  ) {
    super(measureStore, snackBar);
  }

  ngOnInit(): void {
    super.onInit();
  }

  ngAfterViewInit(): void {
    super.afterViewInit();
  }
}
